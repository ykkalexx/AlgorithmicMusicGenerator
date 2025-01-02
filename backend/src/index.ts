import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./config/database";
import cookieParser from "cookie-parser";
import { router } from "./routes/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

// route to check the health of the server
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    // Test database connection using the pool
    const connection = await dbConnection.getConnection();
    connection.release();
    console.log("Connected to MySQL database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
