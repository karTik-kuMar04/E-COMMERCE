import pkg from 'pg';
import logger from '../utils/logger.js'

const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'kartik123',
    port: 5432
});



export default pool; 