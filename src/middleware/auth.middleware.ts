import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
interface decodeType {
  userData: User;
}
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.cookies["Authorization"];
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(
      authorization,
      process.env.JWT_SECRET ?? ""
    ) as decodeType;
    const { userData } = decoded;
    req.user = userData;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

//check if role is admin
export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin" });
  }
  next();
};
