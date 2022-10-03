import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../../common/http";
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  validationLength
} from "../../common/vallidation";
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

      if (
        isNaN(Number(req.query.count)) === true ||
        Number(req.query.count) < 0
      )
        throw new APIError(
          "CommentRouter",
          HttpStatusCode.BAD_REQUEST,
          "invalid user count"
        );

      try {
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
    middlewares.checkToken,
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
    middlewares.checkToken,
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
        if (matched) return res.status(200).send();
        return res.status(400).send();
      } catch (err) {
        return next(err);
      }
    }
  );

  // TODO - user 자체를 받아서 nickname 외의 것들도 변경 가능하게 하기
  route.patch(
    "/:id",
    middlewares.checkToken,
    celebrate({
      body: Joi.object({
        nickname: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling post /user/${req.params.id} endpoint, body: ${req.body}`
      );

      try {
        const nickname: string = req.body.nickname;
        validationLength(nickname, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH);

        await userServiceInstance.updateUser(req.params.id as string, nickname);
        logger.debug(`닉네임 변경 결과: ${nickname}`);

        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );
};
