import { Router } from "express";
import auth from "./routes/auth";
import comment from "./routes/comment";
import helloworld from "./routes/test";

export default () => {
  const app = Router();
  comment(app);
  auth(app);
  helloworld(app);

  return app;
};
