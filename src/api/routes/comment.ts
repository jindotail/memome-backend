import { Router, Request, Response } from "express";
const route = Router();

export default (app: Router) => {
  app.use("/comment", route);

  route.get("/", (req: Request, res: Response) => {
    return res.json({ res: "Hello World" }).status(200);
  });
};
