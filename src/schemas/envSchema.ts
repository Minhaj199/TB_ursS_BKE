import z from "zod";

const isValidRegex = (value: string) => {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
};

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  ACCESS_EXPIRES_IN: z.string().default("15m"),    
  REFRESH_EXPIRES_IN: z.string().default("7d"), 
  MAX_URLS_PER_DAY:z.string().default('100'),   
  BASE_URL:z.string('base url not found').min(1,'base url not found'),
  EMAIL_REGEX: z
    .string()
    .min(1, "EMAIL_REGEX is required")
    .refine(isValidRegex, "EMAIL_REGEX must be a valid regular expression"),

  PHONE_REGEX: z
    .string()
    .min(1, "PHONE_REGEX is required")
    .refine(isValidRegex, "PHONE_REGEX must be a valid regular expression"),
});