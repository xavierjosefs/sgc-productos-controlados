import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser() {
  try {
    const email = 'jorge26.jls@outlook.com';
    const password = '123456';
    const fullName = 'Jorge Salcé';
    const cedula = '00000000001'; // Cédula temporal
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Primero, insertar o actualizar el usuario
    const userQuery = `
      INSERT INTO users (full_name, cedula, email, password_hash, role_id)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $4, role_id = $5, full_name = $1
      RETURNING *;
    `;
    
    const userValues = [fullName, cedula, email, hashedPassword, 7]; // 7 = admin
    
    const userResult = await pool.query(userQuery, userValues);
    
    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   Nombre:', fullName);
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Rol:', 'admin');
    console.log('   Datos completos:', userResult.rows[0]);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    await pool.end();
    process.exit(1);
  }
}

createAdminUser();
