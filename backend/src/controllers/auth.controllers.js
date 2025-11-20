import { createUser , findUserByEmail } from "../models/user.client.js";
import { createPendingUser, findPendingByToken, deletePendingUser, deletePendingUserByEmail } from "../models/pending.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from 'bcrypt';

export const preRegister = async (req, res) => {
    const { full_name, email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    await deletePendingUserByEmail(normalizedEmail); // Eliminar cualquier pre-registro previo con el mismo email

    const existingUser = await findUserByEmail(normalizedEmail);
    // console.log(existingUser);
    if (existingUser) {
        return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 15); // Token válido por 15 minutos

    await createPendingUser(full_name, normalizedEmail, token, expires);

    const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:3000";
    const link = `http://${FRONTEND_URL}/pre-data?token=${token}`;

    const subject = "Completa tu registro";
    const text = `Hola ${full_name},\n\nPor favor, completa tu registro haciendo clic en el siguiente enlace:\n\n${link}\n\nEste enlace expirará en 15 minutos.\n\nSi no solicitaste este correo, ignóralo.`;
    const to = normalizedEmail;

    await sendEmail(to, subject, text);

    res.json({ message: "Pre-registro exitoso. Revisa tu correo para completar el registro.", link });
};

export const getPreData = async (req, res) => {
    const { token } = req.query;

    const pendingUser = await findPendingByToken(token);

    if (!pendingUser) {
        return res.status(400).json({ error: "Token inválido o expirado." });
    }

    return res.json({ full_name: pendingUser.full_name, email: pendingUser.email });
};


export const registerComplete = async (req, res) => {
  const { token, password } = req.body;

  const pending = await findPendingByToken(token);

  if (!pending) {
    return res.status(400).json({ ok: false, message: "Token inválido o expirado" });
  }

  const hash = await bcrypt.hash(password, 10);

  await createUser(pending.full_name, pending.email, hash);

  await deletePendingUser(pending.id);

  res.json({ ok: true, message: "Registro completado con éxito" });
};
