import {findUserByEmail} from "../models/user.client.js";
import { createPendingUser } from "../models/pending.client.js";
import  {getAllUsers}  from "../models/admin.client.js";
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