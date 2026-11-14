import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILecture extends Document {
  title: string;
  description: string;
  videoUrl: string;
  course: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lecture: Model<ILecture> = mongoose.model<ILecture>("Lecture", lectureSchema);

export default Lecture;
