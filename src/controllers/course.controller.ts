import { Request, Response } from "express";
import * as courseService from "../services/course.service";

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, thumbnail } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      price === null ||
      !thumbnail
    ) {
      res.status(400).json({
        success: false,
        message: "All fields (title, description, price, thumbnail) are required",
      });
      return;
    }

    const course = await courseService.createCourse({
      title,
      description,
      price,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

export const getAllCourses = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses = await courseService.getAllCourses();

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch courses",
    });
  }
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch course",
    });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail } = req.body;

    const course = await courseService.updateCourse(id, {
      title,
      description,
      price,
      thumbnail,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update course",
    });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await courseService.deleteCourse(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete course",
    });
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
