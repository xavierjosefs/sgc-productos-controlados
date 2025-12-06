import { getAllServiceTypes, updateService } from "../models/service.client.js";

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


export const updateServiceController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body; // contiene los campos a actualizar

    const updated = await updateService(id, data);

    res.json({
      ok: true,
      message: "Servicio actualizado correctamente",
      service: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error actualizando el servicio"
    });
  }
};

