import {getDNCDRequest} from "../models/user.client.js";

export const getDNCDRequestsController = async (req, res) => {
    try {
        const requests = await getDNCDRequest();

        return res.status(200).json({
            ok: true,
            requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para dncd:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
}