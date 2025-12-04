import {findUserByEmail, findUserByCedula} from "../models/user.client.js";
import { createPendingUser } from "../models/pending.client.js";
import  {getAllUsers, changeUserRole, getAllRequest, changeUserStatus, createService, findServiceByCodigo, getServices, getFormTypes}  from "../models/admin.client.js";
import { sendEmail } from "../utils/sendEmail.js";

import crypto from "crypto";

export const adminCreateInternalUser = async (req, res) => {
  try {
    const { cedula, full_name, email, role } = req.body; // role = "ventanilla", "dncd", etc.

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    await createPendingUser(
      cedula,
      full_name,
      normalizedEmail,
      token,
      expires,
      role
    );

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${FRONTEND_URL}/pre-data?token=${token}`;

    const subject = "Completa tu registro interno";
    const text = `Hola ${full_name},\n\nHas sido registrado en el sistema con el rol ${role}.\nCompleta tu registro en el siguiente enlace:\n\n${link}`;

    await sendEmail(normalizedEmail, subject, text);

    res.json({ message: "Usuario interno creado. Revisa tu correo para completar el registro." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando usuario interno." });
  }
};

export const getAllUsersController = async (req, res) => {
    try {
        await res.json({ users: await getAllUsers() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo usuarios." });
    }
};

export const changeUserRoleController = async (req, res) => {
    try {
        const { cedula, newRole } = req.body;
        const user = await findUserByCedula(cedula);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        await changeUserRole(cedula, newRole);
        res.json({ message: "Rol de usuario actualizado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando rol de usuario." });
    }
};

export const getAllRequestsController = async (req, res) => {
  try {
      const requests = await getAllRequest();
      res.json({ requests });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error obteniendo solicitudes." });
  }
};

export const changeUserStatusController = async (req, res) => {
  try {
    const { cedula } = req.params;

    const updatedUser = await changeUserStatus(cedula);

    res.json({
      ok: true,
      message: "Estado de usuario actualizado.",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ ok: false, error: error.message });
    }

    res.status(500).json({
      ok: false,
      error: "Error actualizando estado de usuario."
    });
  }
};

export const adminCreateServiceController = async (req, res) => {
  try {
    const { codigo_servicio, nombre_servicio, precio, documentos_requeridos, formulario } = req.body;
    // console.log(formulario) 
    const existService = await findServiceByCodigo(codigo_servicio);
    if (existService) {
      return res.status(400).json({ error: "El código de servicio ya existe." });
    }
    const newService = await createService(codigo_servicio, nombre_servicio, precio, documentos_requeridos, formulario);
    res.json({ message: "Servicio creado exitosamente.", service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando servicio." }); 
  }
};

export const getAllServicesController = async (req, res) => {
  try {
    const services = await getServices();
    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo servicios." });
  }
}

export const getAllFormsController = async (req, res) => {
  try {
    const forms = await getFormTypes();
    res.json({ forms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo formularios." });
  }
}