import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { IUserSignUpDTO } from "../../interfaces/IUser";
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
        const result = await authServiceInstance.signUp(
          req.body as IUserSignUpDTO
        );
        return res.status(201).json({
          body: result,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
