import { NextFunction, Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/helloworld", route);

  route.get("/", async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      body: "Hello World!",
    });
  });
};
