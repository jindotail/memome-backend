import BaseError from "@/errors/baseError";
import { errorHandler } from "@/errors/ErrorHandler";
import { NextFunction, Request, Response } from "express";

export const withError = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!errorHandler.isTrustedError(err)) {
    next(err);
  }
  await errorHandler.handleError(err);
  res.status((err as BaseError).httpCode);
  res.send((err as BaseError).message);
};
