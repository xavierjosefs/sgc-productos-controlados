import { getRequestsForVentanilla } from "../models/user.client.js";

/**
 * Controller to get requests for Ventanilla role
 * Returns requests with estado 'ENVIADA'
 */
export const getVentanillaRequestsController = async (req, res) => {
    try {
        const requests = await getRequestsForVentanilla();

        return res.status(200).json({
            ok: true,
            requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para ventanilla:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
