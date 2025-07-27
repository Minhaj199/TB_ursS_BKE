import dotenv from "dotenv";
import path from "path";
import { envSchema } from "../schemas/envSchema";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  NODE_ENV: parsedEnv.data.NODE_ENV,
  PORT: Number(parsedEnv.data.PORT),
  MONGO_URI: parsedEnv.data.MONGO_URI,
  ACCESS_TOKEN_SECRET: parsedEnv.data.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: parsedEnv.data.REFRESH_TOKEN_SECRET,
  ACCESS_EXPIRES_IN: parsedEnv.data.ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN: parsedEnv.data.REFRESH_EXPIRES_IN,
  EMAIL_REGEX: new RegExp(parsedEnv.data.EMAIL_REGEX),
  PHONE_REGEX: new RegExp(parsedEnv.data.PHONE_REGEX),
  MAX_URLS_PER_DAY:parseInt(parsedEnv.data.MAX_URLS_PER_DAY),
  BASE_URL:parsedEnv.data.BASE_URL
};
