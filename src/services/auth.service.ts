import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SafeAdminInfo {
  _id: unknown;
  id: unknown;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  token: string;
  admin: SafeAdminInfo;
}

export const loginAdmin = async (
  credentials: LoginCredentials
): Promise<LoginResult> => {
  const { email, password } = credentials;

  if (!email || !password) {
    const error: any = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error: any = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }

  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      username: admin.username,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );

  const safeAdmin: SafeAdminInfo = {
    _id: admin._id,
    id: admin._id,
    username: admin.username,
    email: admin.email,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };

  return {
    token,
    admin: safeAdmin,
  };
};

export default {
  loginAdmin,
};
