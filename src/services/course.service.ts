import mongoose from "mongoose";
import Course, { ICourse } from "../models/Course";

export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: string;
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createCourse = async (
  input: CreateCourseInput
): Promise<ICourse> => {
  const { title, description, price, thumbnail } = input;

  if (
    !title ||
    !description ||
    price === undefined ||
    price === null ||
    !thumbnail
  ) {
    throw new AppError(
      "All fields (title, description, price, thumbnail) are required",
      400
    );
  }

  const parsedPrice = Number(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    throw new AppError("Price must be a non-negative number", 400);
  }

  const course = new Course({
    title: title.trim(),
    description: description.trim(),
    price: parsedPrice,
    thumbnail: thumbnail.trim(),
  });

  return await course.save();
};

export const getAllCourses = async (): Promise<ICourse[]> => {
  return await Course.find().sort({ createdAt: -1 });
};

export const getCourseById = async (id: string): Promise<ICourse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Course ID format", 400);
  }

  const course = await Course.findById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

export const updateCourse = async (
  id: string,
  input: UpdateCourseInput
): Promise<ICourse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Course ID format", 400);
  }

  const updateData: Partial<CreateCourseInput> = {};

  if (input.title !== undefined) {
    if (!input.title.trim()) {
      throw new AppError("Title cannot be empty", 400);
    }
    updateData.title = input.title.trim();
  }

  if (input.description !== undefined) {
    if (!input.description.trim()) {
      throw new AppError("Description cannot be empty", 400);
    }
    updateData.description = input.description.trim();
  }

  if (input.price !== undefined && input.price !== null) {
    const parsedPrice = Number(input.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new AppError("Price must be a non-negative number", 400);
    }
    updateData.price = parsedPrice;
  }

  if (input.thumbnail !== undefined) {
    if (!input.thumbnail.trim()) {
      throw new AppError("Thumbnail URL cannot be empty", 400);
    }
    updateData.thumbnail = input.thumbnail.trim();
  }

  const course = await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

export const deleteCourse = async (id: string): Promise<ICourse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Course ID format", 400);
  }

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
};

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
