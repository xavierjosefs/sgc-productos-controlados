import pool from "../config/db.js";

export const getAllServiceTypes = async () => {
    const result = await pool.query("SELECT * FROM tipos_servicio ORDER BY id ASC");
    return result.rows;
};

export const updateService = async (id, fields) => {
  const allowedFields = [
    "nombre_servicio",
    "precio",
    "formulario_id",
    "documentos_requeridos"
  ];

  const updates = [];
  const values = [];
  let index = 1;

  for (const key of Object.keys(fields)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = $${index}`);
      values.push(fields[key]);
      index++;
    }
  }

  if (updates.length === 0) {
    throw new Error("No hay campos válidos para actualizar.");
  }

  values.push(id);
  const query = `
    UPDATE tipos_servicio
    SET ${updates.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new Error("Servicio no encontrado.");
  }

  return result.rows[0];
};

