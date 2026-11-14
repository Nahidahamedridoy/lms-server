import { Router } from "express";
import {
  createLecture,
  getLecturesByCourse,
  getLectureById,
  updateLecture,
  deleteLecture,
} from "../controllers/lecture.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

// Course-nested lecture routes: /api/courses/:courseId/lectures
router.get("/courses/:courseId/lectures", getLecturesByCourse);
router.post("/courses/:courseId/lectures", authenticate, createLecture);

// Direct lecture routes: /api/lectures/:id
router.get("/lectures/:id", getLectureById);
router.put("/lectures/:id", authenticate, updateLecture);
router.delete("/lectures/:id", authenticate, deleteLecture);

export { router as lectureRoutes };
export default router;
