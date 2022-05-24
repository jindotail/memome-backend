import { Router } from "express";
import auth from "./routes/auth";
import comment from "./routes/comment";

export default () => {
  const app = Router();
  comment(app);
  auth(app);

  return app;
};
