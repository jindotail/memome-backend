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

const getIdFromRequest = (apiType: string, req: Request) => {
  switch (apiType) {
    case "body id":
      return req.body.id;
    case "params id":
      return req.params.id;
    case "params userId":
      return req.params.userId;
    default:
      throw new APIError(
        "getIdFromRequest",
        HttpStatusCode.INTERNAL_SERVER,
        "token에서 userId를 들고오지 못했습니다"
      );
  }
};

export const checkToken = (apiType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = verifyToken(req.cookies.accessToken) as JwtPayload;
      const id = getIdFromRequest(apiType, req);
      checkTokenId(id, token.id);
    } catch (e) {
      next(e);
      return;
    }

    next();
  };
};
