import mongoose from "mongoose";
import Lecture, { ILecture } from "../models/Lecture";
import Course from "../models/Course";

export interface CreateLectureInput {
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface UpdateLectureInput {
  title?: string;
  description?: string;
  videoUrl?: string;
}

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createLecture = async (
  input: CreateLectureInput
): Promise<ILecture> => {
  const { courseId, title, description, videoUrl } = input;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID format", 400);
  }

  const courseExists = await Course.findById(courseId);
  if (!courseExists) {
    throw new AppError("Course not found", 404);
  }

  if (!title || !description || !videoUrl) {
    throw new AppError(
      "All fields (title, description, videoUrl) are required",
      400
    );
  }

  if (!title.trim() || !description.trim() || !videoUrl.trim()) {
    throw new AppError("Fields cannot be empty", 400);
  }

  const lecture = new Lecture({
    title: title.trim(),
    description: description.trim(),
    videoUrl: videoUrl.trim(),
    course: courseId,
  });

  return await lecture.save();
};

export const getLecturesByCourse = async (
  courseId: string
): Promise<ILecture[]> => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course ID format", 400);
  }

  const courseExists = await Course.findById(courseId);
  if (!courseExists) {
    throw new AppError("Course not found", 404);
  }

  return await Lecture.find({ course: courseId }).sort({ createdAt: 1 });
};

export const getLectureById = async (id: string): Promise<ILecture> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid lecture ID format", 400);
  }

  const lecture = await Lecture.findById(id).populate(
    "course",
    "title description price thumbnail"
  );
  if (!lecture) {
    throw new AppError("Lecture not found", 404);
  }

  return lecture;
};

export const updateLecture = async (
  id: string,
  input: UpdateLectureInput
): Promise<ILecture> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid lecture ID format", 400);
  }

  const updateData: Partial<UpdateLectureInput> = {};

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

  if (input.videoUrl !== undefined) {
    if (!input.videoUrl.trim()) {
      throw new AppError("Video URL cannot be empty", 400);
    }
    updateData.videoUrl = input.videoUrl.trim();
  }

  const lecture = await Lecture.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!lecture) {
    throw new AppError("Lecture not found", 404);
  }

  return lecture;
};

export const deleteLecture = async (id: string): Promise<ILecture> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid lecture ID format", 400);
  }

  const lecture = await Lecture.findByIdAndDelete(id);
  if (!lecture) {
    throw new AppError("Lecture not found", 404);
  }

  return lecture;
};

export default {
  createLecture,
  getLecturesByCourse,
  getLectureById,
  updateLecture,
  deleteLecture,
};
