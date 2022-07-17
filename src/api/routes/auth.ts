import { generateToken, verifyToken } from "@/common/jwt";
import config from "@/config";
import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { IUserLoginDTO, IUserSignUpDTO } from "../../interfaces/IUser";
import AuthService from "../../services/auth";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  app.use("/auth", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const authServiceInstance = Container.get(AuthService);

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required(),
        nickname: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling Sign-Up endpoint with body: %o", req.body);

      try {
        await authServiceInstance.signUp(req.body as IUserSignUpDTO);
        return res.status(201).json({
          body: "SUCCESS",
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/login",
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling Login endpoint with body: %o", req.body);

      try {
        const { accessToken, refreshToken } = await authServiceInstance.login(
          req.body as IUserLoginDTO
        );
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        return res.status(200).json({
          body: "SUCCESS",
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/logout",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling Logout endpoint");

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({
        body: "SUCCESS",
      });
    }
  );

  route.post(
    "/token",
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling token endpoint");

      try {
        verifyToken(req.cookies.refreshToken);
      } catch (e) {
        next(e);
        return;
      }

      const accessToken = generateToken(
        req.body.id as string,
        config.accessTokenExpire
      );
      res.cookie("accessToken", accessToken);

      return res.status(200).json({
        body: "SUCCESS",
      });
    }
  );
};
