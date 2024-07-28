import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000000000,
  message: "Too nasty, please slow down"
});

const slow = slowDown({
  delayAfter: 50,
  windowMs: 15 * 60 * 1000,
  delayMs: 100,
  maxDelayMs: 1000,
});

export { limiter, slow };
