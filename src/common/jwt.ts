import config from "@/config";
import * as jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (e) {
    console.log(e);
  }
};

export const generateToken = (idx: number, expiresIn: string) => {
  return jwt.sign({ idx: idx }, config.jwtSecret, { expiresIn: expiresIn });
};
