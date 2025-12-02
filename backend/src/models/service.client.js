import pool from "../config/db.js";

export const getAllServiceTypes = async () => {
    const result = await pool.query("SELECT * FROM tipos_servicio ORDER BY id ASC");
    return result.rows;
};
