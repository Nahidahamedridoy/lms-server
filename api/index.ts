import dotenv from "dotenv";
dotenv.config();

import app from "../src/app";
import connectDB from "../src/config/db";

// Pre-connect to MongoDB during serverless cold start to minimize request latency
connectDB().catch((err) => {
  console.error("MongoDB cold start connection failed:", err);
});

export default app;
