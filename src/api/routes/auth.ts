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
import { generateToken, verifyToken } from "../../common/jwt";
import {
  ID_MAX_LENGTH,
  ID_MIN_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PW_ANSWER_MAX_LENGTH,
  PW_ANSWER_MIN_LENGTH,
  PW_MAX_LENGTH,
  PW_MIN_LENGTH,
  PW_QUESTION_MAX_LENGTH,
  PW_QUESTION_MIN_LENGTH,
  validAlphabetOrNumber,
  validationLength,
} from "../../common/vallidation";
import config from "../../config";
import APIError from "../../errors/APIError";
import { IUserLoginDTO, IUserSignUpDTO } from "../../interfaces/IUser";
import AuthService from "../../services/auth";
import UserService from "../../services/user";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  app.use("/auth", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const authServiceInstance = Container.get(AuthService);
  const userServiceInstance = Container.get(UserService);

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
        const passwordQuestion: string = req.body.passwordQuestion;
        const passwordAnswer: string = req.body.passwordAnswer;

        // TODO - 어떻게 좀 해봐........
        validationLength(id, ID_MIN_LENGTH, ID_MAX_LENGTH);
        validAlphabetOrNumber(id);
        validationLength(password, PW_MIN_LENGTH, PW_MAX_LENGTH);
        validationLength(nickname, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH);
        validationLength(
          passwordQuestion,
          PW_QUESTION_MIN_LENGTH,
          PW_QUESTION_MAX_LENGTH
        );
        validationLength(
          passwordAnswer,
          PW_ANSWER_MIN_LENGTH,
          PW_ANSWER_MAX_LENGTH
        );

        await authServiceInstance.signUp(req.body as IUserSignUpDTO);
        const { accessToken, refreshToken } = await authServiceInstance.login({
          id,
          password,
        });

        res.cookie("accessToken", accessToken, {});
        res.cookie("refreshToken", refreshToken, {});

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

        res.cookie("accessToken", accessToken, {});
        res.cookie("refreshToken", refreshToken, {});

        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );

  route.get(
    "/kakao/login",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("Calling Login endpoint with body: %o", req.body);

      try {
        if (req.query.code === undefined)
          throw new APIError(
            "CommentRouter",
            HttpStatusCode.BAD_REQUEST,
            "invalid user count"
          );

        // const accessToken = generateToken(user.id, config.accessTokenExpire);
        // const refreshToken = generateToken(user.id, config.refreshTokenExpire);

        return res.status(200).json({
          users: "users",
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
      logger.debug(`Calling cookies endpoint`);

      logger.debug("accessToken");
      logger.debug(req.cookies.accessToken);
      logger.debug("refreshToken");
      logger.debug(req.cookies.refreshToken);

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

      const sess: CookieOptions = { sameSite: "none", secure: true };
      res.cookie("accessToken", accessToken, sess);
      logger.debug(`accessToken: ${accessToken}`);

      return res.status(200).send();
    }
  );

  route.post(
    "/change_password",
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    middlewares.checkToken("body id", "passwordToken"),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug("change  password");

      try {
        validationLength(
          req.body.password as string,
          PW_MIN_LENGTH,
          PW_MAX_LENGTH
        );
        await userServiceInstance.updateUser(req.body.id as string, req.body);
        res.clearCookie("passwordToken");
        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );
};
