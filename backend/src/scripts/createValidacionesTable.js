import pool from "../config/db.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createValidacionesTable = async () => {
  try {
    const sql = fs.readFileSync(
      join(__dirname, '..', '..', 'supabase', 'validaciones.sql'),
      'utf8'
    );

    await pool.query(sql);
    console.log('✅ Tabla validaciones_ventanilla creada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear tabla:', error.message);
    process.exit(1);
  }
};

createValidacionesTable();
