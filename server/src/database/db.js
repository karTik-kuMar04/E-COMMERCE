import pkg from 'pg';
import { env } from '../config/index.js';

const { Pool } = pkg;

const pool = new Pool({
    user: env.PG_USER,
    host: env.PG_HOST,
    database: env.PG_DATABASE,
    password: env.PG_PASSKEY,
    port: env.PG_PORT 
});



export default pool; 