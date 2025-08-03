import { NextFunction, Request, Response } from "express";
import { validateLongUrl } from "../utils/zodvalidator";
import { nanoid } from "nanoid";
import { env } from "../config/env";
import urlModel from "../model/urlModel";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";
import z from "zod";
import redis from "../config/radis";

export const urlContrller = {
  createUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validate = validateLongUrl(req.body);
      if (validate.success) {
        const originalUrl = validate.url;
        const userId = req.userID;
        const shortCode = nanoid(6);
        //////////days 30 days////////////////
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const shortUrl = `${env.BASE_URL}/api/url/${shortCode}`;
        const newUrl = await urlModel.create({
          userId,
          originalUrl,
          shortCode,
          shortUrl,
          expiresAt,
        });
        res.json({
          success: true,
          shortUrl: newUrl.shortUrl,
          expiresAt,
        });
      } else {
        throw new AppError(
          "url validation error",
          HttpStatus.BAD_REQUEST,
          ErrorType.FieldError,
          validate.errors
        );
      }
    } catch (error) {
      next(error);
    }
  },
  fetchUrls: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 3 } = req.query;
      const userId = req.userID;
   
      const urls = await urlModel
        .find({ userId: userId }, { userId: 0 })
        .sort({ _id: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      const count: number = await urlModel
        .find({ userId: userId })
        .countDocuments();
      const today = new Date().toISOString().split("T")[0];
      const key = `user:${userId}:date:${today}`;
      const dialyLimit = (await redis.get(key)) || "0";
      res.json({ urls, dialyLimit: parseInt(dialyLimit), totalUrl: count });
    } catch (error) {
      next(error);
    }
  },
  urlRedirecting: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shortCode = req.params.shortUrl;

      const shortValidator = z
        .string()
        .min(6, "not valid url")
        .max(6, "not valid url");
      const validUrl = shortValidator.parse(shortCode);

      if (validUrl) {
        const inRedis = await redis.get(shortCode);
        if (inRedis) {
          await urlModel.updateOne(
            { shortCode: shortCode },
            { $inc: { clicks: +1 } }
          );
          res.redirect(inRedis);
        } else {
          const fetchLongUrl = await urlModel.findOne(
            { shortCode: validUrl },
            {}
          );
          if (fetchLongUrl && fetchLongUrl.originalUrl) {
            await urlModel.updateOne(
              { shortCode: shortCode },
              { $inc: { clicks: +1 } }
            );
            await redis.set(shortCode, fetchLongUrl.originalUrl, "EX", 3600);
            res.redirect(fetchLongUrl.originalUrl);
          } else {
            throw new Error("invalid link");
          }
        }
      } else {
        throw new Error("invalid link");
      }
    } catch (error) {
      next(error);
    }
  },
};
