import { HttpStatusCode } from "@/common/http";
import BaseError from "@/errors/baseError";
import logger from "@/loaders/logger";
import { isCelebrateError } from "celebrate";
import { NextFunction, Request, Response } from "express";

export const withError = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (isCelebrateError(err)) {
    res.status(HttpStatusCode.BAD_REQUEST);
    res.json({
      error: err.message,
    });
  } else if (isTrustedError(err)) {
    res.status((err as BaseError).httpCode);
    res.json({
      error: err.message,
    });
  }

  next();
};

const isTrustedError = (error: Error) => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};
