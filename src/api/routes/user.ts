import { celebrate, Joi } from "celebrate";
import {
  CookieOptions,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../../common/http";
import { generateToken } from "../../common/jwt";
import config from "../../config";
import APIError from "../../errors/APIError";
import UserService from "../../services/user";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/user", route);
  app.use("/user", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const userServiceInstance = Container.get(UserService);

  route.get(
    "/random",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling get /user/${req.query.count} endpoint`);

      try {
        if (
          isNaN(Number(req.query.count)) === true ||
          Number(req.query.count) < 0
        )
          throw new APIError(
            "CommentRouter",
            HttpStatusCode.BAD_REQUEST,
            "invalid user count"
          );

        const { users } = await userServiceInstance.getRandomUserId(
          Number(req.query.count)
        );
        return res.status(200).json({
          users: users,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Calling get /user/${req.params.id} endpoint`);

    try {
      const user = await userServiceInstance.getUserInfo(
        req.params.id as string
      );
      return res.status(200).json({
        id: user.id,
        nickname: user.nickname,
      });
    } catch (err) {
      return next(err);
    }
  });

  route.delete(
    "/:id",
    middlewares.checkToken("params id", "accessToken"),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling delete /user/${req.params.id} endpoint`);

      try {
        await userServiceInstance.deleteUserById(req.params.id as string);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );

  route.get(
    "/:id/password_question",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling get /user/${req.params.id}/password_question endpoint`
      );

      try {
        const passwordQuestion =
          await userServiceInstance.getUserPasswordQuestion(
            req.params.id as string
          );
        return res.status(200).json({
          passwordQuestion,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.post(
    "/:id/password_question",
    celebrate({
      body: Joi.object({
        passwordAnswer: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling post /user/${req.params.id}/password_question endpoint`
      );

      try {
        const matched =
          await userServiceInstance.matchPasswordQuestionAndAnswer(
            req.params.id as string,
            req.body.passwordAnswer
          );
        logger.debug(`비밀번호 찾기 확인 결과: ${matched}`);

        const passwordToken = generateToken(
          req.params.id as string,
          config.passwordTokenExpire
        );

        const sess: CookieOptions = { sameSite: "none", secure: true };
        res.cookie("passwordToken", passwordToken, sess);

        if (matched) return res.status(200).send();
        return res.status(400).send();
      } catch (err) {
        return next(err);
      }
    }
  );

  route.patch(
    "/:id",
    middlewares.checkToken("params id", "accessToken"),
    celebrate({
      body: Joi.object({
        nickname: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling post /user/${req.params.id} endpoint, body: ${req.body}`
      );

      try {
        await userServiceInstance.updateUser(req.params.id as string, req.body);

        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );
};
