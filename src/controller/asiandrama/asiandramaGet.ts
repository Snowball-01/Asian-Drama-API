import { scrapeContent } from "../../scraper/asiandrama/asiandramaGetController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError } from "../../utils/modifier";
import { Request, Response } from "express";

export async function getAsianDrama(req: Request, res: Response) {
  try {
    const id = req.query.id as string;
    if (!id) throw Error("Parameter id is required");

    /**
     * @api {get} /asiandrama/get?id=:id Get asiandrama
     * @apiName Get asiandrama
     * @apiGroup asiandrama
     * @apiDescription Get a asiandrama video based on id
     *
     * @apiParam {String} id Video ID
     *
     * @apiSuccessExample {json} Success-Response:
     *   HTTP/1.1 200 OK
     *   HTTP/1.1 400 Bad Request
     *
     * @apiExample {curl} curl
     * curl -i https://localhost:3000/asiandrama/get?id=men-in-love-2024-episode-30
     *
     * @apiExample {js} JS/TS
     * import axios from "axios"
     *
     * axios.get("https://localhost:3000/asiandrama/get?id=men-in-love-2024-episode-30")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     *
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("https://localhost:3000/asiandrama/get?id=men-in-love-2024-episode-30") as resp:
     *    print(await resp.json())
     */

    const url = `${c.ASIANDRAMA}/videos/${id}`;
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
