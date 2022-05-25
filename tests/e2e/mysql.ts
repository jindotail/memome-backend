import mysql from "mysql2/promise";
import config from "./config";

const dbConfig = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  port: config.db.port,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

export const query = async (sql: string) => {
  const connection = await pool.getConnection();
  const [result] = await connection.query(sql);
  connection.release();
  return result;
};
