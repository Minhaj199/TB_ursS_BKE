import crypto from "crypto";
import { env } from "../config/env";
const ENC_KEY =env.ENC_KEY; 
const IV = env.ENC_IV
export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
    

}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}