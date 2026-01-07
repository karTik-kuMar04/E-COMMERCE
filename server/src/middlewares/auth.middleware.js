import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import { findUserByEmail } from "../services/user.service.js";
import { genrateAccessToken } from "../utils/token.js";

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "No access token" });
    }

    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET);
      const user = await findUserByEmail(decoded.email);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      return next();
    } catch (err) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Session expired" });
      }

      const refreshDecoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      );

      const user = await findUserByEmail(refreshDecoded.email);
      if (!user || user.refresh_token !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // 🔄 Issue new access token
      const newAccessToken = genrateAccessToken(user);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      req.user = user;
      return next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
