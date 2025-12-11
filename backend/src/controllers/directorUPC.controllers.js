import {getRequestsForDirectorUPC, getDirectorUPCRequestDetails, directorUPCDecision} from "../models/user.client.js";

export const getDirectorRequestsController = async (req, res) => {
  try {
    const requests = await getRequestsForDirectorUPC();
    
    console.log('📋 Solicitudes para Director Técnico:', requests.length);
    console.log('Solicitudes:', requests);

    res.json({
      ok: true,
      requests
    });

  } catch (error) {
    console.error('Error en getDirectorRequestsController:', error);

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

export const directorUPCDecisionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, comentario } = req.body;

    const resultado = await directorUPCDecision(id, { decision, comentario });

    res.json({
      ok: true,
      message: "Decisión del Director UPC registrada correctamente.",
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