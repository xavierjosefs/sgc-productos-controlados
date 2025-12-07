import {getRequestsForDirectorUPC, getDirectorUPCRequestDetails} from "../models/user.client.js";

export const getDirectorRequestsController = async (req, res) => {
  try {
    const requests = await getRequestsForDirectorUPC();

    res.json({
      ok: true,
      requests
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Error obteniendo solicitudes para el Director."
    });
  }
};

export const getDirectorUPCRequestDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await getDirectorUPCRequestDetails(id);
    console.log(detalle);
    

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