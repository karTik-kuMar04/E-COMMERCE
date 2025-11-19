import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../services/user.service.js';
import logger from '../utils/logger.js'

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



export {
    register
}