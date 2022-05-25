import UserModel from "@/models/user";
import CommentService from "@/services/comment";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { Container } from "typedi";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  const getUserIdxById = async (userId: string): Promise<number> => {
    const userModelInstance = Container.get(UserModel);
    const user = await userModelInstance.findById(userId);

    return user[0].idx;
  };

  route.post(
    "/:userId",
    celebrate({
      body: Joi.object({
        comment: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const userIdx = await getUserIdxById(req.params.userId as string);
      const commentServiceInstance = Container.get(CommentService);
      const result = await commentServiceInstance.create(
        userIdx,
        req.body.comment
      );
      return res.status(201).json({
        body: result,
      });
    }
  );

  route.get("/:userId", async (req: Request, res: Response) => {
    const userIdx = await getUserIdxById(req.params.userId as string);
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.getComments(userIdx);
    return res.status(200).json({
      comments: result,
    });
  });
};
