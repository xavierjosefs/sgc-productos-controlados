import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTestUser() {
  try {
    const email = 'test@test.com';
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (full_name, cedula, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET password_hash = $4
      RETURNING *;
    `;
    
    const values = ['Usuario Test', '00000000000', email, hashedPassword];
    
    const result = await pool.query(query, values);
    
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Datos:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1);
  }
}

createTestUser();
