import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listRoles() {
  try {
    const query = 'SELECT * FROM roles ORDER BY id';
    const result = await pool.query(query);
    
    console.log('Roles disponibles:');
    result.rows.forEach(role => {
      console.log(`  ID: ${role.id} - Nombre: ${role.name}`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error listando roles:', error);
    await pool.end();
    process.exit(1);
  }
}

listRoles();
