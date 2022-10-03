import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../../common/http";
import { generateToken, verifyToken } from "../../common/jwt";
import config from "../../config";
import APIError from "../../errors/APIError";
import { IUserLoginDTO, IUserSignUpDTO } from "../../interfaces/IUser";
import AuthService from "../../services/auth";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  app.use("/auth", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const authServiceInstance = Container.get(AuthService);
  const ID_MIN_LENGTH = 3;
  const ID_MAX_LENGTH = 10;
  const PW_MIN_LENGTH = 3;
  const PW_MAX_LENGTH = 20;
  const NICKNAME_MIN_LENGTH = 1;
  const NICKNAME_MAX_LENGTH = 10;
  const PW_QUESTION_MIN_LENGTH = 1;
  const PW_QUESTION_MAX_LENGTH = 30;
  const PW_ANSWER_MIN_LENGTH = 1;
  const PW_ANSWER_MAX_LENGTH = 30;
  

  function validationLength(
    input: string,
    minLength: number,
    maxLength: number
  ): void {
    if (input.length < minLength || maxLength < input.length)
      throw new APIError(
        "AuthRouter",
        HttpStatusCode.BAD_REQUEST,
        "invalid length"
      );
  }

  function validAlphabetOrNumber(input: string): void {
    if (!input.match(/^[0-9a-z]+$/))
      throw new APIError(
        "AuthRouter",
        HttpStatusCode.BAD_REQUEST,
        "not alphanumeric"
      );
  }

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required(),
        nickname: Joi.string().required(),
        passwordQuestion: Joi.string().required(),
        passwordAnswer: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling Sign-Up endpoint with body: %o", req.body);

      try {
        const id: string = req.body.id;
        const password: string = req.body.password;
        const nickname: string = req.body.nickname;
        const passwordQuestion: string = req.body.password;
        const passwordAnswer: string = req.body.password;

        validationLength(id, ID_MIN_LENGTH, ID_MAX_LENGTH);
        validAlphabetOrNumber(id);
        validationLength(password, PW_MIN_LENGTH, PW_MAX_LENGTH);
        validationLength(nickname, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH);
        validationLength(passwordQuestion, PW_QUESTION_MIN_LENGTH, PW_QUESTION_MAX_LENGTH);
        validationLength(passwordAnswer, PW_ANSWER_MIN_LENGTH, PW_ANSWER_MAX_LENGTH);

        await authServiceInstance.signUp(req.body as IUserSignUpDTO);
        return res.status(201).send();
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

        res.cookie("accessToken", accessToken, {
          sameSite: "none",
          secure: true,
        });
        res.cookie("refreshToken", refreshToken, {
          sameSite: "none",
          secure: true,
        });

        return res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshToken,
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
      return res.status(200).send();
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

      // TODO - DB의 refresh token과 같은지 확인

      const accessToken = generateToken(
        req.body.id as string,
        config.accessTokenExpire
      );

      return res.status(200).json({
        accessToken: accessToken,
      });
    }
  );
};
