import {supabase} from "../lib/supabase.js";
import { findSolicitudById, createDocumento, getDocumentosBySolicitudId, sendRequestBySoliciutudId } from "../models/document.client.js";

export const uploadDocumentController = async (req, res) => {
  try {
    const solicitudId = req.params.id;
    const usuarioCedula = req.user.cedula;
    const tipoDocumento = req.body.tipo_documento;
    const archivo = req.file;

    // Verificar que se envie un archivo
    if (!archivo) {
      return res
        .status(400)
        .json({ ok: false, message: "Debe enviar un archivo." });
    }

    // Verificar que exista la solicitud
    const solicitud = await findSolicitudById(solicitudId);

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        message: "Solicitud no encontrada.",
      });
    }

    // Verificar que pertenece al usuario autenticado
    if (solicitud.user_id !== usuarioCedula) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para modificar esta solicitud.",
      });
    }

    const extension = archivo.originalname.split(".").pop();
    // Sanitizar el nombre del tipo de documento para evitar caracteres especiales
    const tipoDocumentoSanitizado = tipoDocumento
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-zA-Z0-9]/g, '_') // Reemplazar caracteres especiales con guión bajo
      .replace(/_+/g, '_') // Reemplazar múltiples guiones bajos con uno solo
      .toLowerCase();
    const nombreArchivoStorage = `${solicitudId}/${tipoDocumentoSanitizado}-${Date.now()}.${extension}`;

    //Subir al bucket de supabase
    const { data, error } = await supabase.storage
      .from("documentos")
      .upload(nombreArchivoStorage, archivo.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: archivo.mimetype,
      });

    if (error) {
      console.error("Error Supabase:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return res.status(500).json({
        ok: false,
        message: `Error al subir archivo a Supabase: ${error.message || error.error || 'Unknown error'}`,
        details: error
      });
    }

    console.log("Archivo subido exitosamente:", data);

    //obtener la url del archivo
    const { data: ulrData } = supabase.storage
      .from("documentos")
      .getPublicUrl(nombreArchivoStorage);
    const url = ulrData.publicUrl;

    //subir la metadata al la base de datos
    const documento = await createDocumento(
      solicitudId,
      tipoDocumento,
      archivo.originalname,
      archivo.mimetype,
      archivo.size,
      url
    );

    const sendRequest = await sendRequestBySoliciutudId(solicitudId);

    return res.status(201).json({
      ok: true,
      message: "Documento subido correctamente.",
      send: sendRequest,
      documento,
    });
  } catch (error) {
    console.error("Error al subir documento:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

export const getDocumentosBySolicitudController = async (req, res) => {
    try {
      const solicitudId = req.params.id;
      const usuarioCedula = req.user.cedula;

      // Verificar que exista la solicitud
      const solicitud = await findSolicitudById(solicitudId);
      if (!solicitud) {
        return res.status(404).json({
          ok: false,
          message: "Solicitud no encontrada.",
        });
      }

      // Verificar que pertenece al usuario autenticado
      if (solicitud.user_id !== usuarioCedula) {
        return res.status(403).json({
          ok: false,
          message: "No tienes permiso para ver los documentos de esta solicitud.",
        });
      }
      const documentos = await getDocumentosBySolicitudId(solicitudId);

      return res.status(200).json({
        ok: true,
        documentos,
      });

    } catch (error) {
      
      return res.status(500).json({
        ok: false,
        message: "Error interno del servidor.",
        error: error.message,
      });

    }
}
