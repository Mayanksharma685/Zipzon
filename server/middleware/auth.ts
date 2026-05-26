import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = await req.auth();
    const { userId } = auth;

    if (!userId) {
      console.log("[Auth] No userId in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized - No authentication token",
      });
    }

    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      console.log("[Auth] User not found in database:", userId);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    console.log("[Auth] User authenticated:", user._id, "Role:", user.role);
    next();
  } catch (error: any) {
    console.error("[Auth] Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log("[Auth] req.user not set");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log("[Auth] User role not authorized:", req.user.role, "Required:", roles);
      return res.status(403).json({
        success: false,
        message: `User role "${req.user.role}" is not authorized to access this route. Required: ${roles.join(", ")}`,
      });
    }

    console.log("[Auth] Authorization granted for role:", req.user.role);
    next();
  };
};