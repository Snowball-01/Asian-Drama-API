import cors from "cors";
import { Router } from "express";
import { slow, limiter } from "../utils/limit-options";

// asiandrama
import { getAsianDrama } from "../controller/asiandrama/asiandramaGet";
import { searchAsianDrama } from "../controller/asiandrama/asiandramaSearch";
import { randomAsianDrama } from "../controller/asiandrama/asiandramaRandom";

function scrapeRoutes() {
  const router = Router();

  router.get("/asiandrama/get", cors(), slow, limiter, getAsianDrama);
  router.get("/asiandrama/search", cors(), slow, limiter, searchAsianDrama);
  router.get("/asiandrama/random", cors(), slow, limiter, randomAsianDrama);
  

  return router;
}

export default scrapeRoutes;
