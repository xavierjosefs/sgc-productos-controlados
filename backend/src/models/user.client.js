import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Funcion para crear un nuevo usuario
export const createUser = async (full_name, cedula, email, password) => {
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

// Funcion para hacer login
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      const error = new Error("No existe una cuenta asociada con ese correo");
      error.statusCode = 400;
      throw error;
    }

    const user = rows[0];

    console.log("Password ingresada:", password);
    console.log("Hash en BD:", user.password_hash);
    console.log("Tipo del hash:", typeof user.password_hash);
    console.log("Longitud del hash:", user.password_hash?.length);


    const isValid = bcrypt.compareSync(password, user.password_hash);
    console.log("Resultado compare:", isValid);


    if (!isValid) {
      const error = new Error("La contraseña es incorrecta");
      error.statusCode = 400;
      throw error;
    }


    delete user.password_hash;

    return { user };
  } catch (err) {
    // Si no tiene statusCode, asumimos 500
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Error interno en el servidor";
    }
    throw err;
  }
};

export const updateUserPassword = async (email, newPassword) => {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE email = $2',
    [passwordHash, normalizedEmail]
  );
};
