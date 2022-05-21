import { Request, Response, Router } from "express";
import CommentService from "../../services/comment";
import { Container } from "typedi";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.get("/", (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    return res
      .status(200)
      .json({ comments: commentServiceInstance.getComments("userId") });
  });

  route.post("/", (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    return res
      .status(201)
      .json({ body: commentServiceInstance.create(req.body.comment) });
  });
};
