import pool from "../config/db.js";
import { createRequest, getRequestsBycedula, getRequestDetailsById } from "../models/user.client.js";
import { getDocumentosBySolicitudId } from "../models/document.client.js";

export const createRequestController = async (req, res) => {
    try {
        const { nombre_servicio, formulario } = req.body;

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
            formulario
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

export const getRequestDetailsController = async (req, res) => {
    try {
        const cedula = req.user.cedula;
        const requestId = req.params.id;

        //validar que la solicitud existe
        const request = await getRequestDetailsById(requestId);
        if (!request) {
            return res.status(404).json({
                ok: false,
                message: "Solicitud no encontrada",
            });
        }

        //validar que la solicitud pertenece al usuario
        if (request.user_id !== cedula) {
            return res.status(403).json({
                ok: false,
                message: "No tienes permiso para ver esta solicitud",
            });
        }

        //obtener los documentos asociados a la solicitud
        const documentos = await getDocumentosBySolicitudId(requestId);
        request.documentos = documentos;
        console.log(request);

        return res.status(200).json({
            ok: true,
            request
        });
    } catch (error) {
        console.error("Error al obtener detalles de la solicitud:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
    //Estoy arreglando el endpoint de ver los detalles de una solicitud
};