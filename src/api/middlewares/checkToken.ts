import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatusCode } from "../../common/http";
import { verifyToken } from "../../common/jwt";
import APIError from "../../errors/APIError";

const checkTokenId = (id: string, tokenId: string) => {
  if (id !== tokenId)
    throw new APIError(
      "verifyToken",
      HttpStatusCode.UNAUTHORIZED,
      "사용자의 토큰이 아닙니다"
    );
};

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = verifyToken(req.cookies.accessToken) as JwtPayload;
    checkTokenId(req.params.id, token.id);
  } catch (e) {
    next(e);
    return;
  }

  next();
};
