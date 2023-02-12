import express from "express";
import "reflect-metadata";
import config from "./config";
import Logger from "./loaders/logger";

async function startServer() {
  const app = express();

  await require("./loaders").default({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err: any) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
