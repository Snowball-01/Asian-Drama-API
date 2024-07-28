import { load } from "cheerio";
import AsianDrama from "../../AsianDrama";
import { ISearchVideoData } from "../../interfaces";
import c from "../../utils/options";

const asiandrama = new AsianDrama();

export async function scrapeContent(url: string) {
  try {
    const resolve = await asiandrama.fetchBody(url);
    const $ = load(resolve);

    class AsianDramaHome {
      search: any;
      constructor() {
        this.search = $("ul.listing.items")
          .find("li.video-block")
          .map((i, el) => {
            return {
              link: `${c.ASIANDRAMA}${$(el).find("a").attr("href")}` || "None",
              id:
                $(el)
                  .find("a")
                  .attr("href")
                  ?.substring(1)
                  .replace("videos/", "")
                  .trim() || "None",
              image: $(el).find("div.picture img").attr("src") || "None",
              title: $(el).find("div.name").text().trim() || "None",
              time_ago: $(el).find("span.date").text().trim() || "None",
            };
          })
          .get();
      }
    }

    const adr = new AsianDramaHome();
    if (adr.search.length === 0) throw Error("No result found");
    const data = adr.search as unknown as string[];
    const result: ISearchVideoData = {
      success: true,
      data: data,
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
