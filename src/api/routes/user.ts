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

  route.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Calling get /user/${req.params.id} endpoint`);

    try {
      const user = await userServiceInstance.getUserInfo(
        req.params.id as string
      );
      return res.status(200).json({
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
        return res.status(200).json({
          body: "SUCCESS",
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
