import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const createUser = async (full_name, cedula, email, password) => {
    // Lógica para crear un usuario en la base de datos
    // Nomalizar datos de entrada
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = full_name.trim();

    const search = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]); // Se revisa que no exista el email en la BD
    if (search.rows.length > 0) {
        throw new Error('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10) // Hashear la contraseña
    const result = await pool.query(
        'INSERT INTO users (cedula, full_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
        [cedula, normalizedName, normalizedEmail, passwordHash]
    );
    return result.rows[0];;
};

export const findUserByEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    return result.rows[0];
};
