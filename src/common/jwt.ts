import * as jwt from "jsonwebtoken";
import config from "../config";
import APIError from "../errors/APIError";
import { HttpStatusCode } from "./http";

export const verifyToken = (token: string) => {
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

export const generateToken = (id: string, expiresIn: string) => {
  return jwt.sign({ id: id }, config.jwtSecret, { expiresIn: expiresIn });
};
