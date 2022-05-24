import { Request, Response, Router } from "express";
import { Container } from "typedi";
import CommentService from "../../services/comment";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.post("/:userId", async (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.create(
      parseInt(req.params.userId, 10),
      req.body.comment
    );
    return res.status(201).json({
      body: result,
    });
  });

  route.get("/:userId", async (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.getComments(
      parseInt(req.params.userId, 10)
    );
    return res.status(200).json({
      comments: result,
    });
  });
};
