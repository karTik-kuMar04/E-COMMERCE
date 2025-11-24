import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken; // 👈 read from cookies

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // attach decoded user
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
