import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function describeTable() {
    try {
        const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'roles'
    `;

        const result = await pool.query(query);

        console.log('Columns in roles table:');
        result.rows.forEach(row => {
            console.log(`- ${row.column_name} (${row.data_type})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error describing table:', error);
        process.exit(1);
    }
}

describeTable();
