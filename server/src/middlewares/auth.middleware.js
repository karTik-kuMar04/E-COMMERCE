import jwt from 'jsonwebtoken'
import { env } from '../config/index.js'

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token"});

        req.user = user;
        next();
    })
}