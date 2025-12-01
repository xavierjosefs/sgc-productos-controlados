import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listUsers() {
  try {
    const query = 'SELECT email, full_name, cedula, role, is_active FROM users LIMIT 10';
    const result = await pool.query(query);
    
    console.log('📋 Usuarios en la base de datos:');
    console.log('=====================================');
    result.rows.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Nombre: ${user.full_name}`);
      console.log(`   Cédula: ${user.cedula}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Activo: ${user.is_active}`);
    });
    console.log('\n=====================================');
    console.log(`Total: ${result.rows.length} usuarios`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
    process.exit(1);
  }
}

listUsers();
