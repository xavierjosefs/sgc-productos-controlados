import pool from "../config/db.js";
import { createRequest, getRequestsBycedula } from "../models/user.client.js";

export const createRequestController = async (req, res) => {
    try {
        const { nombre_servicio, formulario, nombre_estado } = req.body;

        // Validar tipo de servicio
        const servicio = await pool.query(
            "SELECT id FROM tipos_servicio WHERE nombre_servicio = $1",
            [nombre_servicio]
        );
        if (servicio.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: "Tipo de servicio no existe"
            });
        }
        const tipo_servicio_id = servicio.rows[0].id;

        // Validar estado
        const estado = await pool.query(
            "SELECT id FROM estados_solicitud WHERE nombre_mostrar = $1",
            [nombre_estado]
        );
        if (estado.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: "Estado no existe"
            });
        }
        const estado_id = estado.rows[0].id;

        //Validar formulario
        if (!formulario || typeof formulario !== 'object') {
            return res.status(400).json({ message: "Formulario inválido" });
        }

        // Obtener cedula desde token
        const cedula = req.user.cedula;

        // Crear solicitud
        const newRequest = await createRequest(
            cedula,
            tipo_servicio_id,
            formulario,
            estado_id
        );

        return res.status(201).json({
            ok: true,
            message: "Solicitud creada con éxito",
            request: newRequest
        });

    } catch (error) {
        console.error("Error al crear solicitud:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

export const getRequestsController = async (req, res) => {
  try {
    const cedula = req.user.cedula;
    const requests = await getRequestsBycedula(cedula);

    return res.status(200).json({
      ok: true,
      requests,
    });
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor al obtener las solicitudes",
    });
  }
};
