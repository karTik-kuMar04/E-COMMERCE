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

    // database variable's
    PG_USER: requireENV("PG_USER"),
    PG_HOST: requireENV("PG_HOST"),
    PG_DATABASE: requireENV("PG_DATABASE"),
    PG_PASSKEY: requireENV("PG_PASSKEY"),
    PG_PORT: requireENV("PG_PORT"),

    JWT_SECRET: requireENV("JWT_SECRET"),
    JWT_REFRESH_SECRET: requireENV("JWT_REFRESH_SECRET")
}

export default env