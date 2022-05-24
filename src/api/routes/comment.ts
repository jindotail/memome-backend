import UserModel from "@/models/user";
import CommentService from "@/services/comment";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { Container } from "typedi";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.post(
    "/:userId",
    celebrate({
      body: Joi.object({
        comment: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const userModelInstance = Container.get(UserModel);
      const user = await userModelInstance.findById(
        req.params.userId as string
      );

      const commentServiceInstance = Container.get(CommentService);
      const result = await commentServiceInstance.create(
        user[0].idx as number,
        req.body.comment
      );
      return res.status(201).json({
        body: result,
      });
    }
  );

  route.get("/:userId", async (req: Request, res: Response) => {
    const userModelInstance = Container.get(UserModel);
    const user = await userModelInstance.findById(req.params.userId as string);
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.getComments(
      user[0].idx as number
    );
    return res.status(200).json({
      comments: result,
    });
  });
};
