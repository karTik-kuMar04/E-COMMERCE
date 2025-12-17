import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

const genrateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        env.JWT_SECRET,
        { expiresIn: "30m" }
    )
}

const genrateRefreshToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}

export {
    genrateAccessToken,
    genrateRefreshToken
}