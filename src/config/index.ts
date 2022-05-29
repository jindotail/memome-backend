import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const envFound = dotenv.config({ path: "./env/.env" });
if (process.env.NODE_ENV == "dev" && envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.API_PORT, 10),

  db: {
    rootPassword: process.env.MYSQL_ROOT_PASSWORD,
    name: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
  },

  api: {
    prefix: "/api",
  },

  logs: {
    level: process.env.LOG_LEVEL || "debug",
  },
};
