import { NextFunction, Request, Response } from "express";
import { user } from "../model/user";
import { validateLogin, validateSignup } from "../utils/zodvalidator";
import { Types } from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { validatePassword } from "../utils/passwordValidator";
import { ErrorType } from "../constrains/ErrorTypes";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { AppError } from "../errors/customError";
import z from "zod";
import redis from "../config/radis";
import { IUserDoc } from "../types";
import { JwtPayload } from "jsonwebtoken";

export const authController = {
  /////////////// checking username and password is valid///////////
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validate = validateLogin(req.body);
      if (validate.success) {
        const isValidateUser: IUserDoc | null = await user.findOne({
          $or: [
            { email: validate.data.username },
            { phone: validate.data.username },
          ],
        });
        if (isValidateUser) {
          ////////////validate password////////
          const vaidatePasswordData = await validatePassword(
            isValidateUser.password,
            validate.data.password
          );
          /////////////
          if (vaidatePasswordData) {
            /////////////// generting tokens///
            const refreshToken = generateRefreshToken(
              (isValidateUser._id as Types.ObjectId).toString()
            );
            const accessToken = generateAccessToken(
              (isValidateUser._id as Types.ObjectId).toString()
            );
            await redis.set(
              (isValidateUser._id as Types.ObjectId).toString() + "acs_redic",
              refreshToken,
              "EX",
              3600 * 24
            );
            res.json({ success: true, refreshToken, accessToken });
          } else {
            //////////////password not matched///
            throw new AppError(
              "password not match",
              HttpStatus.UNAUTHORIZED,
              ErrorType.FieldError,
              [{ password: "password not matched" }]
            );
          }
        } else {
          ///////////// user not found////////////
          throw new AppError(
            "userAuthentication faild",
            HttpStatus.NOT_FOUND,
            ErrorType.FieldError,
            [{ email: "user not found" }]
          );
        }
      } else {
        ////////////zode validation failed////////////
        if ("GereralError" in validate.errors[0]) {
          throw new AppError(
            "zod Error",
            HttpStatus.BAD_REQUEST,
            ErrorType.GeneralError,
            validate.errors
          );
        } else {
          throw new AppError(
            "zod Error",
            HttpStatus.BAD_REQUEST,
            ErrorType.FieldError,
            validate.errors
          );
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      ////////// validating userdata with zode//////
      const vaidatedData = validateSignup(req.body);
      //////////////////
      if (vaidatedData.success) {
        //////////// user data submitiing to databaase/////
        const result = await user.create(vaidatedData.data);
        if (result._id && result.email) {
          res.json({ success: true });
        } else {
          /////// unidenfied error////
          throw new AppError(
            "unidenfied error",
            HttpStatus.INTERNAL_SERVER_ERROR,
            ErrorType.GeneralError,
            [{ general: "server error plaser try again" }]
          );
        }
      } else {
        ////////////zod validation faild///////////
        throw new AppError(
          "zod error",
          HttpStatus.BAD_REQUEST,
          ErrorType.FieldError,
          vaidatedData.errors
        );
      }
    } catch (error) {
      next(error);
    }
  },
  genereteAccess: async (req: Request, res: Response) => {
    try {
      const tokenvalidator = z.string().min(10);
      const validateToken = tokenvalidator.parse(req.body.refresh);
      const verifyToken: any = verifyRefreshToken(validateToken);
      if (typeof verifyToken === "object" && "userId" in verifyToken) {
        const inRedis = await redis.get(verifyToken.userId + "acs_redic");

        if (inRedis) {
          const token = generateAccessToken(verifyToken.userId);
          return res.json({ token: token });
        } else {
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        const isStutusCode = parseInt(error.message);
        if (!isNaN(isStutusCode)) {
          res.status(HttpStatus.UNAUTHORIZED).json({ jwtValidation: false });
        } else {
        }
      }
    }
  },
};
