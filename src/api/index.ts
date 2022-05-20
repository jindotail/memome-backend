import { Router } from "express";
import comment from "./routes/comment";

export default () => {
  const app = Router();
  comment(app);

  return app;
};
