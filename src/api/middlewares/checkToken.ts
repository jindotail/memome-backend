import { HttpStatusCode } from "@/common/http";
import APIError from "@/errors/APIError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyToken(req.cookies.accessToken);
  } catch (e) {
    next(e);
    return;
  }
  // TODO - 사용자가 같은지 확인 진도가 로그인 -> 말감이 로그인한 경우

  next();
};

const verifyToken = (token: string) => {
  if (token === undefined)
    throw new APIError(
      "verifyToken",
      HttpStatusCode.UNAUTHORIZED,
      "토큰이 존재하지 않습니다"
    );

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      throw new APIError(
        "verifyToken",
        HttpStatusCode.UNAUTHORIZED,
        "토큰이 만료되었습니다"
      );
    }
  }
};
