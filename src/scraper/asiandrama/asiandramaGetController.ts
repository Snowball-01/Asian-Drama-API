import { load } from "cheerio";
import AsianDrama from "../../AsianDrama";
import { IVideoData, ListEpisode, LatestEpisodes } from "../../interfaces";
import c from "../../utils/options";

const asiandrama = new AsianDrama();

export async function scrapeContent(url: string) {
  try {
    const resolve = await asiandrama.fetchBody(url);
    const $ = load(resolve);

    class AsianDramaHome {
      link: string;
      id: string;
      title: string;
      image: string;
      description: string;
      episodes: string;
      duration: any;
      aired_on: string;
      rating: string;
      iframe: string;
      list_episode: ListEpisode[];
      latest_episode: LatestEpisodes[];

      constructor() {
        const paragraphs = $("#rmjs-1 p")
          .filter(function () {
            return $(this).find("span").length === 0;
          })
          .map(function () {
            return $(this).text().trim();
          })
          .get();

        // Extracting the text from the relevant elements
        const episodes = $("#rmjs-1")
          .find("p:contains('Episodes:')")
          .text()
          .replace("Episodes: ", "")
          .trim();
        const duration = $("#rmjs-1")
          .find("p:contains('Duration:')")
          .text()
          .replace("Duration:", "")
          .trim();

        let airedOn = $("#rmjs-1")
          .find("p:contains('Aired On:')")
          .text()
          .replace("Aired On: ", "")
          .trim();

        if (!airedOn) {
          airedOn = $("#rmjs-1")
            .find("p:contains('Airs On:')")
            .text()
            .replace("Airs On: ", "")
            .trim();
        }
        const ratings = $("#rmjs-1")
          .find("p:contains('Content Rating:')")
          .text()
          .replace("Content Rating: ", "")
          .trim();

        this.link =
          `${c.ASIANDRAMA}${$("link[rel='canonical']").attr("href")}` || "None";
        this.id =
          $("link[rel='canonical']")
            .attr("href")
            ?.substring(1)
            .replace("videos/", "")
            .trim() || "None";
        this.title = $("div.video-info-left h1").text() || "None";
        this.image = $("div.picture img").attr("src") || "None";
        this.description =
          paragraphs.join("\n") || $("div.content-more-js").text() || "None";
        this.episodes = episodes || "None";
        this.duration = duration || "None";
        this.aired_on = airedOn || "None";
        this.rating = ratings || "None";
        this.iframe =
          `https://${$("div.play-video iframe").attr("src")?.substring(2)}` ||
          "None";
        this.list_episode = $("ul.listing.items.lists")
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
              thumb: $(el).find("div.picture img").attr("src") || "None",
              title: $(el).find("div.name").text().trim() || "None",
              uploaded_on: $(el).find("span.date").text() || "None",
              type: $(el).find("div.type span").text() || "None",
            };
          })
          .get();

        this.latest_episode = $("ul.listing.items.videos")
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

    const adg = new AsianDramaHome();

    const data: IVideoData = {
      success: true,
      data: {
        title: asiandrama.removeHtmlTagWithoutSpace(adg.title),
        id: adg.id,
        image: adg.image,
        description: adg.description,
        episodes: adg.episodes,
        duration: adg.duration,
        rating: adg.rating,
        aired_on: adg.aired_on,
        iframe: adg.iframe,
      },
      list_episode: adg.list_episode,
      latest_episodes: adg.latest_episode,
      source: adg.link,
    };
    return data;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
