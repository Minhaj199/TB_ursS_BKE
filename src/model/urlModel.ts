import mongoose, { Schema } from "mongoose";
import { IUrl } from "../types";

const urlSchema = new Schema<IUrl>({
  userId: { type: String, required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: new Date() },
});
urlSchema.index({ shortUrl: 1 }, { unique: true });

export default mongoose.model<IUrl>("Url", urlSchema);
