import pool from '../config/db.js';

async function checkEstados() {
    try {
        console.log('=== TODOS LOS ESTADOS EN LA BD ===');
        const estados = await pool.query('SELECT * FROM estados_solicitud ORDER BY id');
        console.table(estados.rows);

        console.log('\n=== SOLICITUDES Y SUS ESTADOS ===');
        const solicitudes = await pool.query(`
            SELECT 
                s.id,
                s.user_id,
                e.nombre_mostrar AS estado,
                e.id AS estado_id,
                s.fecha_creacion
            FROM solicitudes s
            JOIN estados_solicitud e ON s.estado_id = e.id
            ORDER BY s.id
        `);
        console.table(solicitudes.rows);

        console.log('\n=== CONTEO POR ESTADO ===');
        const conteo = await pool.query(`
            SELECT 
                e.nombre_mostrar,
                e.id AS estado_id,
                COUNT(*) as cantidad
            FROM solicitudes s
            JOIN estados_solicitud e ON s.estado_id = e.id
            GROUP BY e.id, e.nombre_mostrar
            ORDER BY e.id
        `);
        console.table(conteo.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

checkEstados();
