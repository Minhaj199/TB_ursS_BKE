import mongoose from "mongoose";
import { env } from "./env";

export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);
    console.log(`DB connect:${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
