import "dotenv/config"; // carga variables de .env
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false } // (normalmente solo para Supabase/producción)
});

export default pool;