import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import { findUserByEmail } from "../services/user.service.js";
import { genrateAccessToken } from "../utils/token.js";

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(403).json({ message: "No Refresh Token Found" })
        }

        jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

            const user = await findUserByEmail(decoded.id);
            if (!user) return res.status(404).json({ message: "user not found"})

            const newAccesToken = genrateAccessToken(user);
            return res.status(201).json({ accessToken: newAccesToken})
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}