import { Request } from "express";
import logger from "../middlewares/winston";

export function logError(req: Request, error: unknown) {
  if (error instanceof Error) {
    logger.error({
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      time: new Date().toISOString(),
    });
  } else {
    logger.error({
      message: "unidentified error",
      stack: "",
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      time: new Date().toISOString(),
    });
  }
}
