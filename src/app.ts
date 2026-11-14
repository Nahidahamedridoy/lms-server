
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import lectureRoutes from "./routes/lecture.routes";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS Backend API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS Backend API is running!",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", lectureRoutes);
app.use("/api/lectures", lectureRoutes);

export default app;
