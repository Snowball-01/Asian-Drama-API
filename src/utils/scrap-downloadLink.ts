import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { DownloadLinks } from "../interfaces";
declare const grecaptcha: any; // Declare grecaptcha as a global variable

async function directDownload(link: string): Promise<string> {
  try {
    // Fetch the data from the URL
    const response = await fetch(link);
    const data = await response.text();

    // Load the data into cheerio
    const $ = cheerio.load(data);

    // Define a regex to match window.location assignments
    const locationRegex = /window\.location\s*=\s*["']([^"']+)["']/g;

    // Select and filter script tags with type="text/javascript" that contain window.location
    let result: string | undefined;
    $('script[type="text/javascript"]').each((i, elem) => {
      const scriptContent = $(elem).html(); // Get the content of the <script> tag

      if (scriptContent) {
        let match;
        // Find all matches in the script content
        while ((match = locationRegex.exec(scriptContent)) !== null) {
          // match[1] contains the URL value
          result = match[1];
          return false; // Exit the loop
        }
      }
    });

    return result || "";
  } catch (error) {
    console.error(`Error fetching link ${link}:`, error);
    return "";
  }
}

async function scrapeWithCaptcha(iframeId: string): Promise<DownloadLinks> {
  const url = `https://asianbxkiun.pro/download?id=${iframeId}&mip=0.0.0.0&refer=https://streamcool.pro/&op=1`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle0" });

  // Ensure grecaptcha is loaded
  await page.waitForFunction(() => typeof grecaptcha !== "undefined");

  // Execute reCAPTCHA
  const token = await page.evaluate(async () => {
    // Ensure the grecaptcha object is available
    if (typeof grecaptcha !== "undefined") {
      return await grecaptcha.execute(
        "6LfeXcMbAAAAADlYf016vYYDZMHhJ3mGhNs921Rl"
      );
    }
    throw new Error("reCAPTCHA is not available.");
  });

  // Make a request with the token
  const htmlResponse = await page.evaluate(async (token) => {
    const result = await fetch(window.location.pathname, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        captcha_v3: token,
        id: "NDE3NDQ2",
      }),
    });

    return result.text(); // Return the HTML response as a string
  }, token);

  await browser.close();

  // Load the HTML response with Cheerio
  const $ = cheerio.load(htmlResponse);
  const downloadLinks: DownloadLinks = {};

  // Collect all promises for directDownload
  const downloadPromises = $(".mirror_link")
    .map(async (_, element) => {
      const linkPromises = $(element)
        .find(".dowload a")
        .map(async (_, link) => {
          const text = $(link).text().trim();
          const href = $(link).attr("href") || "";
          const newref = await directDownload(href);
          const match = text.match(/(\d{3,4}P) - mp4/);
          if (match && newref) {
            downloadLinks[`${match[1]} - mp4`] = newref;
          }
        })
        .get();

      // Wait for all linkPromises to complete
      await Promise.all(linkPromises);
    })
    .get();

  // Wait for all downloadPromises to complete
  await Promise.all(downloadPromises);

  return downloadLinks;
}

export default scrapeWithCaptcha;
