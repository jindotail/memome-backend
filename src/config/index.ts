import dotenv from "dotenv";

process.env.PHASE = process.env.PHASE || "local";

const envFound = dotenv.config({ path: "./env/.env" });
if (process.env.PHASE == "local" && envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  phase: process.env.PHASE,

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

  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || "15d",

  privateKey: process.env.PRIVATE_KEY,
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.PROJECT_ID,
};
