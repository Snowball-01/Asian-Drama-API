import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeStreamWishSite(url: string) {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    // Example: Extracting Streamwish URL
    const streamwishURL = $(".list-server-items")
      .find('li[data-provider="streamwish"]')
      .attr("data-video");

    if (streamwishURL) {
      const { data: streamwishData } = await axios.get(streamwishURL);

      // Extract the URL from the jwplayer setup script
      const scriptTag = streamwishData.match(
        /<script[^>]*>[\s\S]*?jwplayer\("vplayer"\)\.setup\(([\s\S]*?)\);[\s\S]*?<\/script>/i
      );
      if (scriptTag) {
        const scriptContent = scriptTag[1];
        const fileUrlMatch = scriptContent.match(
          /sources:\s*\[{file:"([^"]+)"/
        );
        if (fileUrlMatch) {
          const fileUrl = fileUrlMatch[1];
          return fileUrl;
        } else {
          console.log("File URL not found in the script.");
          return null;
        }
      } else {
        console.log("Script tag not found in the streamwish data.");
        return null;
      }
    } else {
      console.log("Streamwish URL not found.");
      return null;
    }

    // Extract and log more data as needed
  } catch (error) {
    console.error("Error scraping site:", error);
    return null;
  }
}

export default scrapeStreamWishSite;
