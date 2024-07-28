import p from "phin";
import { load } from "cheerio";

const url = "https://pladrac.net/";

async function test() {
  const res = await p({
    url: url,
    "headers": {
      "User-Agent": process.env.USER_AGENT || "asiandrama/1.6.0 Node.js/16.9.1",
    },
  });
    
  const $ = load(res.body);
  const title = $("meta[property='og:title']").attr("content");
  console.log(title);
  console.log(res.statusCode);
}

test().catch(console.error);
