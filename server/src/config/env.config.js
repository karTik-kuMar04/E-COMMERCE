import dotenv from 'dotenv';

dotenv.config();

const requireENV = (key) => {
    
    if (!process.env[key]){
        throw new Error(`Missing required enviroment variable: ${key}`);
    }

    return process.env[key];
};

const env = {
    // server variable's
    PORT: process.env.PORT,

    // client variable's
    CORS_ORIGIN: requireENV("CORS_ORIGIN"),

    // JWT Secret
    JWT_SECRET: requireENV("JWT_SECRET"),
    JWT_REFRESH_SECRET: requireENV("JWT_REFRESH_SECRET"),

    // Cloudinary Secrets
    DATABASE_URL: requireENV("DATABASE_URL"),

    ADMIN_EMAIL: requireENV("ADMIN_EMAIL"),
    EMAIL_PASS: requireENV("EMAIL_PASS") 
}

export default env