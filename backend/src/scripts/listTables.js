import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function listTables() {
    try {
        const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

        const result = await pool.query(query);

        console.log('Tables in database:');
        result.rows.forEach(row => {
            console.log(`- ${row.table_name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error listing tables:', error);
        process.exit(1);
    }
}

listTables();
