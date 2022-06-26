import routes from "@/api";
import config from "@/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

export default ({ app }: { app: express.Application }) => {
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.use(bodyParser.json());
  app.use(cors({ origin: ["https://localhost:3000"], credentials: true }));
  app.use(express.json());
  app.use(config.api.prefix, routes());

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
