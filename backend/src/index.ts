import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/database";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

testConnection();

// route to check the health of the server
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
