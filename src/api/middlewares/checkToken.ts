import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatusCode } from "../../common/http";
import { verifyToken } from "../../common/jwt";
import APIError from "../../errors/APIError";

export const checkTokenId = (req: Request, apiType: string, tokenType: string) => {
  const token = getTokenFromRequest(req, tokenType);
  const varifiedToken = verifyToken(token) as JwtPayload;
  const id = getIdFromRequest(req, apiType);
  return id === varifiedToken.id;
};

// TODO - 이게 아닌 것 같은데 방법을 모르겠다
const getIdFromRequest = (req: Request, apiType: string) => {
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
        "invalid token"
      );
  }
};

const getTokenFromRequest = (req: Request, tokenType: string) => {
  switch (tokenType) {
    case "accessToken":
      return req.cookies.accessToken;
    case "passwordToken":
      return req.cookies.passwordToken;
    default:
      throw new APIError(
        "getTokenFromRequest",
        HttpStatusCode.INTERNAL_SERVER,
        "invalid token"
      );
  }
};

export const checkToken = (apiType: string, tokenType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (checkTokenId(req, apiType, tokenType))
        throw new APIError(
          "verifyToken",
          HttpStatusCode.UNAUTHORIZED,
          "사용자의 토큰이 아닙니다"
        );
    } catch (e) {
      next(e);
      return;
    }

    next();
  };
};
