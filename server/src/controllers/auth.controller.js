import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, updateRefreshToken } from '../services/user.service.js';
import logger from '../utils/logger.js'
import { genrateAccessToken, genrateRefreshToken } from '../utils/token.js';



const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({message: "User already Exists with this email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const refresh_token = genrateRefreshToken({ email });

        const user = await createUser(name, email, hashedPassword, refresh_token)

        res.status(201).json(
            {
                message: "User Registered Successfully",
                user
            }
        )
    } catch (err) {
        logger.error(err)
        res.status(500).json({error: "Server error"})
    }
}


const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        

        const user = await findUserByEmail(email);

        if (!user){
            return res.status(400).json({message: "User not Registered with this E-mail"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "password is incorrect! Try Again"})
        }

        const accessToken = genrateAccessToken(user);
        const refreshToken = genrateRefreshToken(user);

        await updateRefreshToken(user.id, refreshToken) // update refresh token in database

        const COOKIE_OPTIONS = {
            httpOnly: true,
            secure: false,       // ⚠️ false in development (http), true only in production (https)
            sameSite: "lax",
            path: "/",
        };


        res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, { 
            ...COOKIE_OPTIONS, 
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json(
            {
                message: "Log-in Successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        )


    } catch (err) {
        logger.error(err)
        res.status(500).json({error: "Server error"})
    }
}

const logout = async (req, res) => {
  try {
    const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: false,   // change to true in production https only
      sameSite: "lax",
      path: "/",
    };

    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export {
    register,
    login,
    logout
}