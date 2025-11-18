import app from "./app.js";
import { env } from "./config/index.js";
import logger from "./utils/logger.js";
import pool from "./database/db.js";

const PORT = env.PORT || 8080

app.listen(PORT, ()=> {
    pool.connect()
        .then(() => logger.info(`Connected to PostgreSQL`))
        .catch((err) => logger.error(`Failed to connect database: `, err))

    logger.info(`Server is running on PORT: ${PORT}`)
})