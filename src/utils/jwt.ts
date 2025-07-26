import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET =env.REFRESH_TOKEN_SECRET
const ACCESS_EXPIRES_IN = env.ACCESS_EXPIRES_IN  as SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = env.REFRESH_EXPIRES_IN  as SignOptions["expiresIn"];

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
