import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../services/user.service.js';
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

        const user = await createUser(name, email, hashedPassword)

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

        if (!email || !password) {
            return res.status(400).json({message: "All feilds are required"})
        }

        const user = await findUserByEmail(email);

        if (!user){
            return res.status(400).json({message: "User not Registered with this E-mail"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "password is incorrect! Try Again"})
        }

        const AccessToken = genrateAccessToken(user);
        const RefreshToken = genrateRefreshToken(user);

        res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(
            {
                message: "Log-in Successfully",
                AccessToken,
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


export {
    register,
    login
}