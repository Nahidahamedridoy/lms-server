import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db";
import Admin from "../models/Admin";

const seedAdmin = async (): Promise<void> => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !email || !password) {
      console.error(
        "Missing required environment variables: ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be defined."
      );
      process.exit(1);
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(
        `Admin with email "${normalizedEmail}" already exists. Skipping duplicate creation.`
      );
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin seeded successfully:", {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    console.error("Admin seeding failed:", error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("Database connection closed.");
    }
  }
};

seedAdmin();
