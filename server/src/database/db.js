import pkg from "pg";
import { env } from "../config/index.js";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
