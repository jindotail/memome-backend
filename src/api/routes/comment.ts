import { Request, Response, Router } from "express";
import { Container } from "typedi";
import CommentService from "../../services/comment";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.get("/", (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    return res.status(200).json({
      comments: commentServiceInstance.getComments(req.query.userId as string),
    });
  });

  route.post("/", (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    return res
      .status(201)
      .json({ body: commentServiceInstance.create(req.body.comment) });
  });
};
