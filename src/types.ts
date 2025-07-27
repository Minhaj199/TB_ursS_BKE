import { Document } from "mongoose";

export interface IUser {
  email: string;
  phone: string;
  password: string;
}

export interface IUserDoc extends Document, IUser {}

export type SignupValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string>[] };

/////////// mongoose insertOne result/////

export type MongooseInsertOneType = {
  acknowledged: boolean;
  insertedId: string;
};

////////// mongooese error/////
export interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, any>;
}

/////////loginValidationFunction////
export type LoginValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string>[] };

  
export interface IUrl extends Document {
  userId: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  expiresAt: Date;
  createdAt:Date
}