import { NextFunction, Request, Response } from "express";
import { validateLongUrl } from "../utils/zodvalidator";
import { nanoid } from "nanoid";
import { env } from "../config/env";
import urlModel from "../model/urlModel";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";

export const urlContrller = {
  createUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const validate = validateLongUrl(req.body);
      if (validate.success) {
        const originalUrl = validate.url;
        const userId = req.userID;
        const shortCode = nanoid(6);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const shortUrl = `${env.BASE_URL}/${shortCode}`;
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
        throw new AppError('url validation error',HttpStatus.BAD_REQUEST,ErrorType.FieldError,validate.errors)
      }
    } catch (error) {
        next(error)
    }
  },
  fetchUrls:async(req:Request,res:Response,next:NextFunction)=>{
    try { 
        const userId=req.userID
        const urls=await urlModel.find({userId:userId},{userId:0})
        console.log(urls)
        return res.json({urls})
    } catch (error) {
        next(error)
    }
  }
};
