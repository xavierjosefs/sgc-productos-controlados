import supabase from "backendlibsupabase.js";
import { findSolicitudById, createDocumento } from "../models/document.client";

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
    const nombreArchivoStorage = `${solicitudId}/${tipoDocumento}-${Date.now()}.${extension}`;

    //Subir al bucket de supabase
    const { error } = await supabase.storage
      .from("documentos")
      .upload(nombreArchivoStorage, archivo.buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: archivo.mimetype,
      });

    if (error) {
      console.error("Error Supabase:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al subir archivo a Supabase.",
      });
    }

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

    return res.status(201).json({
      ok: true,
      message: "Documento subido correctamente.",
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
