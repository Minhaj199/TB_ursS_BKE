import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { decrypt, encrypt } from "./crypto";


const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES_IN = env.ACCESS_EXPIRES_IN as SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = env.REFRESH_EXPIRES_IN as SignOptions["expiresIn"];
export const generateAccessToken = (userId: string) => {
  try {

    return jwt.sign({ userId:encrypt(userId)},ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("internal server error");
    }
  }
};

export const generateRefreshToken = (userId: string) => {
  try {
    return jwt.sign({ userId:encrypt(userId) }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("internal server error");
    }
  }
};
export const verifyAccessToken = (token: string) => {
  try {
    const payload=jwt.verify(token, ACCESS_TOKEN_SECRET);
    if(typeof payload!=='string'){
      const userId=decrypt(payload.userId)
      return {userId,...payload} 
    }else{
      throw new Error('not valid token')
    }
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("internal server error");
    }
  }
};
export const verifyRefreshToken = (token: string) => {
  try {
    const payload= jwt.verify(token, REFRESH_TOKEN_SECRET);
    if(typeof payload!=='string'){
      const userId=decrypt(payload.userId)
      return {...payload,userId:userId} 
    }else{
      throw new Error('not valid token')
    }
  } catch (error) {
    throw new Error(String(HttpStatus.UNAUTHORIZED));
  }
};
