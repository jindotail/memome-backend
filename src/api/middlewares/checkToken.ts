import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../common/jwt";

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
