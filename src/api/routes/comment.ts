import { Request, Response, Router } from "express";
import { Container } from "typedi";
import CommentService from "../../services/comment";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.post("/", async (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.create(
      req.body.id,
      req.body.comment
    );
    return res.status(201).json({
      body: result,
    });
  });

  route.get("/", async (req: Request, res: Response) => {
    const commentServiceInstance = Container.get(CommentService);
    const result = await commentServiceInstance.getComments(1); // req.query.userId
    return res.status(200).json({
      comments: result,
    });
  });
};
