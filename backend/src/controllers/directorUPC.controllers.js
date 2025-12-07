import getRequestsForDirectorUPC from "../models/user.client";

export const getDirectorRequestsController = async (req, res) => {
  try {
    const requests = await getDirectorRequests();

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