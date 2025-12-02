import { supabase } from "../lib/supabase.js";
import { findSolicitudById, createDocumento, getDocumentosBySolicitudId, sendRequestBySoliciutudId, findDocumentoById, deleteDocumento } from "../models/document.client.js";

export const uploadDocumentController = async (req, res) => {
  try {
    const solicitudId = req.params.id;
    const usuarioCedula = req.user.cedula;
    let tipoDocumento = req.body.tipo_documento;
    const archivo = req.file;

    // Verificar que se envie un archivo
    if (!archivo) {
      return res
        .status(400)
        .json({ ok: false, message: "Debe enviar un archivo." });
    }

    // Si no se especifica el tipo de documento, usar uno por defecto
    if (!tipoDocumento) {
      tipoDocumento = "Documento General";
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
    // Asegurarse de que tipoDocumento sea un string antes de normalizar
    const tipoDocString = String(tipoDocumento || "Documento");

    const tipoDocumentoSanitizado = tipoDocString
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

export const deleteDocumentController = async (req, res) => {
  try {
    const solicitudId = req.params.id;
    const documentoId = req.params.documentId;
    const usuarioCedula = req.user.cedula;

    // Validar que el documento existe
    const documento = await findDocumentoById(documentoId);
    if (!documento) {
      return res.status(404).json({
        ok: false,
        message: "Documento no encontrado.",
      });
    }

    // Validar que el documento pertenece a la solicitud
    if (documento.solicitud_id !== parseInt(solicitudId)) {
      return res.status(400).json({
        ok: false,
        message: "El documento no pertenece a esta solicitud.",
      });
    }

    // Validar que la solicitud existe
    const solicitud = await findSolicitudById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        message: "Solicitud no encontrada.",
      });
    }

    // Validar permisos del usuario
    if (solicitud.user_id !== usuarioCedula) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para eliminar documentos de esta solicitud.",
      });
    }

    // Extraer ruta del archivo desde la URL
    const urlParts = documento.url.split('/documentos/');
    const filePath = urlParts[1];

    // Eliminar archivo de Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documentos")
      .remove([filePath]);

    if (storageError) {
      console.error("Error al eliminar de Supabase:", storageError);
      // Continuar aunque falle, para limpiar BD
    }

    // Eliminar registro de la base de datos
    await deleteDocumento(documentoId);

    return res.status(200).json({
      ok: true,
      message: "Documento eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};
