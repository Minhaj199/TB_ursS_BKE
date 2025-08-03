import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logError } from "../errors/logError";
import { MongoDuplicateKeyError } from "../types";
import { ErrorType } from "../constrains/ErrorTypes";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";

export const erroHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    error instanceof Error &&
    "code" in error &&
    error.code === HttpStatus.MONGO_DUPLICATE
  ) {
    const err = error as MongoDuplicateKeyError;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "unknown";
    return res.status(HttpStatus.BAD_REQUEST).json({
      sucess: false,
      result: [{ [field]: `${field} already exists` }],
      errorType: ErrorType.FieldError,
    });
  } else if (error instanceof AppError) {
    res.status(error.statusCode).json(error.toJSON());
  } else if (error instanceof Error) {
    logError(req, error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ errroMessage: error.message || "server error" });
  } else {
    logError(req, error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ errroMessage: "server error" });
  }
  next();
};
