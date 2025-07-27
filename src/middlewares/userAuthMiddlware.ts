
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";
;
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../constrains/statusCodeContrain"; 
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      userID?: string;
    }
  }
}


export const userJwtAuthenticator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authforuser"];
  const refresh = req.headers["refreshauthforuser"];
  if (token && typeof token === "string") {
    try {
      const decode = verifyAccessToken(token);
      
      if (typeof decode === "string") {
        res.status(HttpStatus.FORBIDDEN).json({
          message: "token is not valid,please log out",
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const isValid = decode as JwtPayload;
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (isValid) {
        if (isValid.exp && isValid.exp > currentTime) {
          req.userID = isValid.userId
          next();
        } else {
          res
            .status(HttpStatus.FORBIDDEN)
            .json({ message: "Token expired", status: HttpStatus.BAD_REQUEST });
        }
      } else {
       res.status(HttpStatus.FORBIDDEN).json({
          message: "validation Faild,please log out",
          status: HttpStatus.FORBIDDEN,
        });
        return
      }
    } catch (error) {
      console.log(error)
      if (
        error instanceof Error &&
        refresh &&
        typeof refresh === "string" &&
        error.message === "jwt expired"
      ) {
        res.status(HttpStatus.FORBIDDEN).json("access token expired");
        return;
      }
      if (error instanceof Error && "TokenExpiredError" in error) {
        res.status(HttpStatus.FORBIDDEN).json({
          message:
            error?.TokenExpiredError || "validation Faild,please log out",
          status: HttpStatus.BAD_REQUEST,
        });
        return;
      } else {
        res.status(HttpStatus.FORBIDDEN).json({
          message: "validation Faild,please log out",
          status: HttpStatus.BAD_REQUEST,
        });
        return;
      }
    }
  }
};
