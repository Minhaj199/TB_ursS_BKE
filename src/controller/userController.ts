import { NextFunction, Request, Response } from "express";
import { user } from "../model/user";
import { validateLogin, validateSignup } from "../utils/zodvalidator";
import { Types } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { validatePassword } from "../utils/passwordValidator";
import { ErrorType } from "../constrains/ErrorTypes";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { AppError } from "../errors/customError";

export const authController = {
  /////////////// checking username and password is valid///////////
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validate = validateLogin(req.body);
      if (validate.success) {
        const isValidateUser = await user.findOne({
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
            const refreshTokens = generateRefreshToken(
              (isValidateUser._id as Types.ObjectId).toString()
            );
            const accessTokens = generateAccessToken(
              (isValidateUser._id as Types.ObjectId).toString()
            );
            res.json({ success: true, refreshTokens, accessTokens });
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
       console.log(validate.errors)
       if('GereralError' in validate.errors[0]){
        throw new AppError(
           "zod Error",
           HttpStatus.BAD_REQUEST,
           ErrorType.GeneralError,
           validate.errors
         );
       }else{
         throw new AppError(
           "zod Error",
           HttpStatus.BAD_REQUEST,
           ErrorType.FieldError,
           validate.errors
         );
       }
      }
    } catch (error) {
      console.log(error)
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
};
