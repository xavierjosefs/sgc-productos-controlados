import pool from '../config/db.js';

(async () => {
    try {
        console.log('\n📊 Verificando solicitudes y estados...\n');
        
        // Ver últimas solicitudes
        const solicitudes = await pool.query(`
            SELECT 
                s.id,
                s.estado_id,
                e.nombre_mostrar,
                e.codigo_estado,
                s.fecha_creacion
            FROM solicitudes s
            JOIN estados_solicitud e ON s.estado_id = e.id
            ORDER BY s.id DESC
            LIMIT 10
        `);
        
        console.log('Últimas 10 solicitudes:');
        console.table(solicitudes.rows);
        
        // Ver cuántas hay en cada estado relevante
        const conteos = await pool.query(`
            SELECT 
                e.id,
                e.codigo_estado,
                e.nombre_mostrar,
                COUNT(s.id) as cantidad
            FROM estados_solicitud e
            LEFT JOIN solicitudes s ON s.estado_id = e.id
            WHERE e.id IN (6, 7, 8, 18)
            GROUP BY e.id, e.codigo_estado, e.nombre_mostrar
            ORDER BY e.id
        `);
        
        console.log('\nConteo por estados relevantes:');
        console.table(conteos.rows);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
})();
