import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import requestIp from "request-ip";
import { Container } from "typedi";
import { Logger } from "winston";
import CommentService from "../../services/comment";
import UserService from "../../services/user";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);
  app.use("/comment", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const commentServiceInstance = Container.get(CommentService);
  const userServiceInstance = Container.get(UserService);

  route.post(
    "/:userId",
    celebrate({
      body: Joi.object({
        comment: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling post /comment/${req.params.userId} endpoint with body: %o`,
        req.body
      );

      let owner = false;
      try {
        // 본인이 댓글 작성한 경우
        owner = middlewares.isUserIdTokenIdSame(
          req,
          "params userId",
          "accessToken"
        );
      } catch (err) {
        // do nothing
        // 에러를 던졌지만 그냥 본인이 작성한 댓글이 아닌 것으로 처리
        // TODO - 좀 더 잘 짜보자
      }

      try {
        const userIdx = await userServiceInstance.getUserIdxById(
          req.params.userId as string
        );
        // TODO - client ip 들고오는 부분 미들웨어로 빼면 좋을 것 같음
        await commentServiceInstance.create(
          userIdx,
          req.body.comment,
          requestIp.getClientIp(req),
          owner
        );
        res.status(201).send();
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    "/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling get /comment/${req.params.userId} endpoint`);
      try {
        const userIdx = await userServiceInstance.getUserIdxById(
          req.params.userId as string
        );

        const size: undefined | number =
          isNaN(Number(req.query.size)) === true || Number(req.query.size) < 0
            ? undefined
            : Number(req.query.size);
        const result = await commentServiceInstance.getComments(userIdx, size);
        logger.silly(
          `[CommentRoute] getComments result: ${JSON.stringify(result)}`
        );
        return res.status(200).json({
          body: result,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.delete(
    "/:userId/:commentIdx",
    middlewares.checkToken("params userId", "accessToken"),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling delete /comment/${req.params.userId}/${req.params.commentIdx} endpoint`
      );

      try {
        await commentServiceInstance.deleteCommentByIdx(req.params.commentIdx);

        return res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );
};
