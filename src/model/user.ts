import mongoose, { Schema } from "mongoose";
import { IUserDoc } from "../types";
import bcrypt from "bcrypt";

const schema = new Schema<IUserDoc>(
  {
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
schema.pre("save", async function (next) {
  const user = this as IUserDoc;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const user = mongoose.model<IUserDoc>("users", schema);
