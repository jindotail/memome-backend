import { Request, Response, Router } from "express";
import { Container } from "typedi";
import AuthService from "../../services/auth";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post("/signup", async (req: Request, res: Response) => {
    const authServiceInstance = Container.get(AuthService);
    const result = await authServiceInstance.signUp(req.body.nickname);
    return res.status(201).json({
      body: result,
    });
  });
};
