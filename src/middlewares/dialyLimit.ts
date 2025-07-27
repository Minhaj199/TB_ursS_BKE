import { NextFunction, Request, Response } from "express";
import redis from "../config/radis";
import { env } from "../config/env";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { AppError } from "../errors/customError";
import { ErrorType } from "../constrains/ErrorTypes";

const MAX_URLS_PER_DAY = env.MAX_URLS_PER_DAY;

export async function checkDailyLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userID;
    const today = new Date().toISOString().split("T")[0];
    const key = `user:${userId}:date:${today}`;

    const count = await redis.incr(key);

    if (count === 1) {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      await redis.expire(key, ttl);
    }

    if (count > MAX_URLS_PER_DAY) {
      throw new AppError(
        "url validation error",
        HttpStatus.BAD_REQUEST,
        ErrorType.FieldError,
        [{ url: `maximum limit is ${env.MAX_URLS_PER_DAY}/day` }]
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}
