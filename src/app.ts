import express from "express";

async function startServer() {
  const app = express();

  await require("./loaders").default({ expressApp: app });

  app
    .listen(8080, () => {
      console.log(`
      ################################################
      🛡️  Server listening on port: ${8080} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
}

startServer();
