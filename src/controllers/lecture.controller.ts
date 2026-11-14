import { Request, Response } from "express";
import * as lectureService from "../services/lecture.service";

export const createLecture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl } = req.body;

    const lecture = await lectureService.createLecture({
      courseId,
      title,
      description,
      videoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create lecture",
    });
  }
};

export const getLecturesByCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const lectures = await lectureService.getLecturesByCourse(courseId);

    res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch lectures",
    });
  }
};

export const getLectureById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const lecture = await lectureService.getLectureById(id);

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch lecture",
    });
  }
};

export const updateLecture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl } = req.body;

    const lecture = await lectureService.updateLecture(id, {
      title,
      description,
      videoUrl,
    });

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      data: lecture,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update lecture",
    });
  }
};

export const deleteLecture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const lecture = await lectureService.deleteLecture(id);

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
      data: lecture,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete lecture",
    });
  }
};

export default {
  createLecture,
  getLecturesByCourse,
  getLectureById,
  updateLecture,
  deleteLecture,
};
