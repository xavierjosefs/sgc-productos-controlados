import { getAllServiceTypes } from "../models/service.client.js";

export const getServiceTypesController = async (req, res) => {
    try {
        const serviceTypes = await getAllServiceTypes();
        return res.status(200).json(serviceTypes);
    } catch (error) {
        console.error("Error al obtener tipos de servicio:", error);
        return res.status(500).json({
            message: "Error interno del servidor al obtener tipos de servicio",
            error: error.message,
        });
    }
};
