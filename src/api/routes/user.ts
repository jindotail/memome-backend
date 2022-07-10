import { HttpStatusCode } from "@/common/http";
import APIError from "@/errors/APIError";
import UserService from "@/services/user";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
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
        const { ids } = await userServiceInstance.getRandomUserId(
          Number(req.query.count)
        );
        return res.status(200).json({
          ids: ids,
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
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling delete /user/${req.params.id} endpoint`);

      try {
        await userServiceInstance.deleteUserById(req.params.id as string);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({
          body: "SUCCESS",
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
