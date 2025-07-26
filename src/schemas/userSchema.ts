import * as z from "zod";
import dotenv from "dotenv";
import { env } from "../config/env";
dotenv.config();
/////////////user signup validation schema////
const emailRegexRow = env.EMAIL_REGEX
const emailRegex = new RegExp(emailRegexRow);
const phoneRegexRow = env.PHONE_REGEX
const phoneRegex = new RegExp(phoneRegexRow);
export const UserSignup = z
  .object({
    email: z.string("email not found").trim().email({
      pattern: emailRegex,
      message: "not valid email",
    }),
    phone: z.string("phone number not found").trim(),
    password: z.string("not valid password").trim().min(6, "minimum length 6"),
  })
  .refine(
    (data) => {
      const isPhone = phoneRegex;
      return isPhone.test(data.phone);
    },
    {
      message: "Not valid phone number",
      path: ["phone"],
    }
  );
export type UserSchema = z.infer<typeof UserSignup>;

/////////////user login validation schema////

export const UserLoginSchema = z
  .object({
    username: z.string("not valid username").trim(),
    password: z.string("not valid password").trim().min(6, "minimum length 6"),
  })
  .refine(
    (data) => {
      return phoneRegex.test(data.username) || emailRegex.test(data.username);
    },
    {
      message: "Not valid username",
      path: ["username"],
    }
  );
export type UserLoginSchemaType = z.infer<typeof UserLoginSchema>;
