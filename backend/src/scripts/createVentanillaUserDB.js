import 'dotenv/config';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

async function createVentanillaUserDB() {
  try {
    const cedula = '00100000001';
    const email = 'fabianyoguen2@gmail.com';
    const password = '123456';
    const full_name = 'Fabian';
    const role_id = 2; // ventanilla

    console.log('Creando usuario de ventanilla en PostgreSQL...');

    // Verificar si el usuario ya existe
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR cedula = $2',
      [email, cedula]
    );

    if (checkUser.rows.length > 0) {
      console.log('Usuario ya existe, actualizando...');
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const result = await pool.query(
        `UPDATE users 
         SET full_name = $1, email = $2, password_hash = $3, role_id = $4, is_active = true
         WHERE cedula = $5
         RETURNING *`,
        [full_name, email, passwordHash, role_id, cedula]
      );

      console.log('✅ Usuario actualizado:', result.rows[0]);
    } else {
      console.log('Creando nuevo usuario...');
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const result = await pool.query(
        `INSERT INTO users (cedula, full_name, email, password_hash, role_id, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         RETURNING *`,
        [cedula, full_name, email, passwordHash, role_id]
      );

      console.log('✅ Usuario creado:', result.rows[0]);
    }

    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Rol: ventanilla (role_id: 2)');
    console.log('\n✨ Usuario listo para usar');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createVentanillaUserDB();
