/**
 * Migration Script: Create historial_solicitud table
 * This table stores the timeline/history of all events for each request
 */

import pool from '../config/db.js';

async function createHistorialTable() {
    try {
        console.log('🚀 Creating historial_solicitud table...');

        // Create the table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS historial_solicitud (
                id SERIAL PRIMARY KEY,
                solicitud_id INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
                estado_anterior_id INTEGER REFERENCES estados_solicitud(id),
                estado_nuevo_id INTEGER REFERENCES estados_solicitud(id),
                usuario_id VARCHAR(20) REFERENCES users(cedula),
                rol_usuario VARCHAR(50),
                accion VARCHAR(100) NOT NULL,
                comentario TEXT,
                metadata JSONB,
                fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ Table created successfully');

        // Create indexes for better query performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_historial_solicitud_id 
            ON historial_solicitud(solicitud_id);
        `);
        console.log('✅ Index on solicitud_id created');

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_historial_fecha 
            ON historial_solicitud(fecha_evento);
        `);
        console.log('✅ Index on fecha_evento created');

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_historial_usuario 
            ON historial_solicitud(usuario_id);
        `);
        console.log('✅ Index on usuario_id created');

        // Verify table exists
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'historial_solicitud'
            ORDER BY ordinal_position;
        `);

        console.log('\n📋 Table structure:');
        console.table(result.rows);

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Error creating table:', error.message);
        throw error;
    } finally {
        await pool.end();
        process.exit(0);
    }
}

createHistorialTable();
