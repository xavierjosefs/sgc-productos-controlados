import { getRequestsForTecnicoUPC, getTecnicoUPCRequestDetails, validarSolicitudTecnica } from "../models/user.client.js";

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

export const getTecnicoUPCRequestDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await getTecnicoUPCRequestDetails(id);

    res.json({
      ok: true,
      detalle
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

export const validarSolicitudTecnicaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const resultado = await validarSolicitudTecnica(id, data);

    res.json({
      ok: true,
      message: "Validación técnica registrada correctamente.",
      resultado
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      error: error.message
    });
  }
};