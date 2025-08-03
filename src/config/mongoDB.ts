import mongoose from "mongoose";
import { env } from "./env";
import urlModel from "../model/urlModel";

export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);
    console.log(`DB connect:${connection.connection.host}`);
    await urlModel.syncIndexes();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

