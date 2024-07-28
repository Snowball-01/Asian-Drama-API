import { scrapeContent } from "../../scraper/asiandrama/asiandramaRandomController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError } from "../../utils/modifier";
import { Request, Response } from "express";

export async function randomAsianDrama(req: Request, res: Response) {
  try {
    /**
     * @api {get} /.asiandrama/random Get random .asiandrama
     * @apiName Get random .asiandrama
     * @apiGroup .asiandrama
     * @apiDescription Get a random .asiandrama video
     *
     * @apiSuccessExample {json} Success-Response:
     *   HTTP/1.1 200 OK
     *   HTTP/1.1 400 Bad Request
     *
     * @apiExample {curl} curl
     * curl -i https://localhost:3000/asiandrama/random?&page=1
     *
     * @apiExample {js} JS/TS
     * import axios from "axios"
     *
     * axios.get("https://localhost:3000/asiandrama/random?&page=1")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     *
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("https://localhost:3000/asiandrama/random?&page=1") as resp:
     *    print(await resp.json())
     */

    const page = req.query.page || 1;
    if (isNaN(Number(page))) throw Error("Parameter page must be a number");
    
    const url = `${c.ASIANDRAMA}/?page=${page}`;
    console.log(url);
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
