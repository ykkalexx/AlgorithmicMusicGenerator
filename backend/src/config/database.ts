import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const dbConnection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "music_generator",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
