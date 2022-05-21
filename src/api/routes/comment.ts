import { Request, Response, Router } from "express";
const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ comments: ["Hello", "World"] });
  });

  route.post("/", (req: Request, res: Response) => {
    return res.status(201).json({ body: req.body });
  });
};
