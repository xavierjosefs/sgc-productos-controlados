import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listEstados() {
  try {
    const query = 'SELECT * FROM estados_solicitud';
    const result = await pool.query(query);
    
    console.log('📋 Estados de solicitud en la base de datos:');
    console.log('=====================================');
    result.rows.forEach((estado, index) => {
      console.log(`\n${index + 1}. ID: ${estado.id}`);
      console.log(`   Nombre: ${estado.nombre}`);
      console.log(`   Nombre Mostrar: ${estado.nombre_mostrar}`);
    });
    console.log('\n=====================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listando estados:', error);
    process.exit(1);
  }
}

listEstados();
