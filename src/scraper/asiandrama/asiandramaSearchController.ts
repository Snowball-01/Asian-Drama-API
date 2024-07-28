import { load } from "cheerio";
import AsianDrama from "../../AsianDrama";
import c from "../../utils/options";
import { ISearchVideoData } from "../../interfaces";

const asiandrama = new AsianDrama();

export async function scrapeContent(url: string) {
  try {
    const res = await asiandrama.fetchBody(url);
    const $ = load(res);

    class AsianDramaSearch {
      search: object[];

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

    const ads = new AsianDramaSearch();
    if (ads.search.length === 0) throw Error("No result found");
    const data = ads.search as unknown as string[];
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
