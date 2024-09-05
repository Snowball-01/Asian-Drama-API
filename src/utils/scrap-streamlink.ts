import * as cheerio from "cheerio";

function decodeLink(p: string, a: number, c: number, k: string[]): string {
  function baseConvert(number: number, base: number): string {
    /** Convert a number to a string in a given base (up to base 36). */
    if (number < 0) return "-" + baseConvert(-number, base);
    if (number === 0) return "0";

    const digits: string[] = [];
    while (number) {
      const remainder = number % base;
      digits.push(
        remainder < 10
          ? remainder.toString()
          : String.fromCharCode(remainder + 87)
      );
      number = Math.floor(number / base);
    }

    return digits.reverse().join("");
  }

  while (c) {
    c -= 1;
    const baseCStr = baseConvert(c, a);
    if (k[c]) {
      const regex = new RegExp(`\\b${baseCStr}\\b`, "gi");
      p = p.replace(regex, k[c]);
    }
  }
  const match = p.match(/file:"([^"]+)"/);

  return match?.[0].slice(6, -1) || "None";
}

const extractData = (trailed: string): [string, string[]] => {
  const endIndex: number = trailed.indexOf("}}}}'") + 5;
  return [trailed.slice(2, endIndex), trailed.slice(endIndex + 1).split(",")];
};

function fileData(string: string): string {
  const [fileDataStr, params] = extractData(string.slice(114, -2));
  const a = parseInt(params[0], 10);
  const c = parseInt(params[1], 10);
  const k = eval(params[2]); // Make sure this is safe, or avoid using eval
  const data = decodeLink(fileDataStr, a, c, k);
  return data;
}

async function scrapeStreamlink(url: string): Promise<string | null> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const src = $("li[data-provider='streamwish']").attr("data-video");
  if (!src) return null;

  const streamwish = await fetch(src);
  const streamwishhtml = await streamwish.text();
  const streamwish$ = cheerio.load(streamwishhtml);
  const filemetadata = streamwish$("script[type='text/javascript']")
    .eq(3)
    .text()
    .trim();
  if (!filemetadata) return null;
  const filedata = fileData(filemetadata);
  if (!filedata) return null;
  return filedata;
}

export default scrapeStreamlink;
