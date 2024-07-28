import { scrapeContent } from "../../scraper/asiandrama/asiandramaSearchController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError, spacer } from "../../utils/modifier";
import { Request, Response } from "express";

export async function searchAsianDrama(req: Request, res: Response) {
  try {
    /**
     * @api {get} /asiandrama/search Search asiandrama videos
     * @apiName Search asiandrama
     * @apiGroup asiandrama
     * @apiDescription Search asiandrama videos
     * @apiParam {String} key Keyword to search
     * @apiParam {Number} [page=1] Page number
     *
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    HTTP/1.1 400 Bad Request
     *
     * @apiExample {curl} curl
     * curl -i https://localhost:3000/asiandrama/search?key=Friends
     * curl -i https://localhost:3000/asiandrama/search?key=Friends&page=2
     *
     * @apiExample {js} JS/TS
     * import axios from "axios"
     *
     * axios.get("https://localhost:3000/asiandrama/search?key=Friends")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     *
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("https://localhost:3000/asiandrama/search?key=Friends") as resp:
     *    print(await resp.json())
     */

    const key = req.query.key as string;
    const page = req.query.page || 1;
    if (isNaN(Number(page))) throw Error("Parameter page must be a number");

    if (!key) throw Error("Parameter key is required");

    let url;
    if (key === "movies") {
      url = `${c.ASIANDRAMA}/movies?page=${page}`;
    } else if (key === "kshow") {
      url = `${c.ASIANDRAMA}/kshow?page=${page}`;
    } else if (key === "popular") {
      url = `${c.ASIANDRAMA}/popular?page=${page}`;
    } else if (key === "ongoing") {
      url = `${c.ASIANDRAMA}/ongoing-series?page=${page}`;
    } else {
      url = `${c.ASIANDRAMA}/search.html?keyword=${spacer(key)}`;
    }

    // console.log(url);

    const data = await scrapeContent(url);
    logger.info({
      path: req.path,
      query: req.query,
      method: req.method,
      ip: req.ip,
      useragent: req.get("User-Agent"),
    });
    return res.json(data);
  } catch (err) {
    const e = err as Error;
    res.status(400).json(maybeError(false, e.message));
  }
}
