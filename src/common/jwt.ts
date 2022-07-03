import config from "@/config";
import * as jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (e) {
    console.log(e);
  }
};

export const generateToken = (idx: number, days: number) => {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + days);

  return jwt.sign(
    {
      idx: idx,
      exp: exp.getTime() / 1000,
    },
    config.jwtSecret
  );
};
