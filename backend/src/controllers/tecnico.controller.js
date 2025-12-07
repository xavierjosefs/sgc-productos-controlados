import { getRequestsForTecnicoUPC } from "../models/user.client.js";

export const getTecnicoUPCRequestsController = async (req, res) => {
    try {
        const requests = await getRequestsForTecnicoUPC();

        return res.status(200).json({
            ok: true,
            requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para tecnico upc:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
}