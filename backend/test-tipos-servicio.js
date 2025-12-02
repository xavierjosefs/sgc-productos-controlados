import pool from './src/config/db.js';

async function getTiposServicio() {
  try {
    const result = await pool.query('SELECT id, nombre_servicio FROM tipos_servicio ORDER BY id');
    console.log('\n=== TIPOS DE SERVICIO EN LA BASE DE DATOS ===\n');
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`Nombre: "${row.nombre_servicio}"`);
      console.log('---');
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getTiposServicio();
