import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function deleteTestUser() {
  try {
    const query = "DELETE FROM users WHERE email = 'test@test.com' RETURNING *";
    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      console.log('✅ Usuario test@test.com eliminado exitosamente');
    } else {
      console.log('ℹ️  Usuario test@test.com no encontrado');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    process.exit(1);
  }
}

deleteTestUser();
