import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "../api";
import config from "../config";

export default ({ app }: { app: express.Application }) => {
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  // TODO - 없는 페이지 404 처리
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Hello",
    });
  });

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: "http://localhost:3000/" }));
  app.use(express.json());
  app.use(config.api.prefix, routes());

  app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
