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
    CORS_ORIGIN: requireENV("CORS_ORIGIN")

    // database variable's
}

export default env