/**
 * Migration Script: Populate historial for existing requests
 * Creates initial timeline entries for requests that existed before the feature
 */

import pool from '../config/db.js';

async function migrateHistorial() {
    try {
        console.log('🚀 Starting historial migration for existing requests...\n');

        // Get all existing requests with their creation data
        const requestsResult = await pool.query(`
            SELECT 
                s.id,
                s.user_id,
                s.estado_id,
                s.fecha_creacion,
                e.nombre_mostrar AS estado_actual,
                e.codigo_estado
            FROM solicitudes s
            JOIN estados_solicitud e ON s.estado_id = e.id
            ORDER BY s.id ASC
        `);

        const requests = requestsResult.rows;
        console.log(`📋 Found ${requests.length} existing requests to process\n`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const request of requests) {
            // Check if request already has historial entries
            const existingResult = await pool.query(
                'SELECT COUNT(*) as count FROM historial_solicitud WHERE solicitud_id = $1',
                [request.id]
            );

            if (parseInt(existingResult.rows[0].count) > 0) {
                console.log(`⏭️  Request #${request.id} already has historial, skipping`);
                skippedCount++;
                continue;
            }

            // Create initial CREACION entry
            await pool.query(`
                INSERT INTO historial_solicitud 
                (solicitud_id, estado_anterior_id, estado_nuevo_id, usuario_id, rol_usuario, accion, comentario, metadata, fecha_evento)
                VALUES ($1, NULL, 1, $2, 'cliente', 'CREACION', 'Entrada migrada automáticamente', '{"migrated": true}', $3)
            `, [request.id, request.user_id, request.fecha_creacion]);

            // If request is not in initial state (Pendiente = 1), add a state change entry
            if (request.estado_id !== 1) {
                const currentDate = new Date();
                await pool.query(`
                    INSERT INTO historial_solicitud 
                    (solicitud_id, estado_anterior_id, estado_nuevo_id, usuario_id, rol_usuario, accion, comentario, metadata, fecha_evento)
                    VALUES ($1, 1, $2, NULL, 'sistema', 'ESTADO_MIGRADO', $3, '{"migrated": true, "automatico": true}', $4)
                `, [request.id, request.estado_id, `Estado actual: ${request.estado_actual}`, currentDate]);
            }

            console.log(`✅ Request #${request.id} - Created historial entries`);
            migratedCount++;
        }

        console.log('\n========================================');
        console.log(`✅ Migration completed successfully!`);
        console.log(`   - Migrated: ${migratedCount} requests`);
        console.log(`   - Skipped: ${skippedCount} requests (already had historial)`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error during migration:', error.message);
        throw error;
    } finally {
        await pool.end();
        process.exit(0);
    }
}

migrateHistorial();
