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

      try {
        // TODO - client ip 들고오는 부분 미들웨어로 빼면 좋을 것 같음
        const userIdx = await userServiceInstance.getUserIdxById(
          req.params.userId as string
        );
        await commentServiceInstance.create(
          userIdx,
          req.body.comment,
          requestIp.getClientIp(req)
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
        const result = await commentServiceInstance.getComments(userIdx);
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
