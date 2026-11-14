import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtAdminPayload } from "../types/express";

export interface AuthenticatedRequest extends Request {
  admin?: JwtAdminPayload;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer" || !parts[1]) {
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
    });
    return;
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured on the server",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtAdminPayload;

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token has expired"
          : "Invalid or malformed token",
    });
    return;
  }
};

export const authMiddleware = authenticate;
export default authenticate;
