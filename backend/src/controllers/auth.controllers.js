import { createUser, findUserByEmail, login, updateUserPassword } from "../models/user.client.js";
import { createPendingUser, findPendingByToken, deletePendingUser, deletePendingUserByEmail } from "../models/pending.client.js";
import { createResetToken, findResetToken, deleteResetToken } from "../models/recovery.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { isValidDominicanCedula } from "../utils/validateCedula.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const preRegister = async (req, res) => {
  const { cedula, full_name, email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidDominicanCedula(cedula)) {
    return res.status(400).json({ error: "Cédula inválida." });
  }

  await deletePendingUserByEmail(normalizedEmail);

  const existingUser = await findUserByEmail(normalizedEmail);
  // console.log(existingUser);
  if (existingUser) {
    return res.status(400).json({ error: "El correo ya está registrado." });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 15); // Token válido por 15 minutos

  await createPendingUser(cedula, full_name, email, token, expires);

  const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:5173";
  const link = `${FRONTEND_URL}/pre-data?token=${token}`;

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

  await createUser(pending.full_name, pending.cedula, pending.email, password);
  await deletePendingUser(pending.cedula);


  res.json({ ok: true, message: "Registro completado con éxito" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Llego aqui");

  try {
    console.log("Intentando iniciar sesión para:", email);
    const { user } = await login(email, password);
    const token = jwt.sign({ cedula: user.cedula }, process.env.SECRET_KEY, { expiresIn: "8h" })

    return res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso",
      user,
      token
    });
  } catch (err) {
    const status = err.statusCode || 500;

    return res.status(status).json({
      ok: false,
      message: err.message || "Error al iniciar sesión",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El correo es requerido" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    // Simulamos espera para evitar timing attacks
    await new Promise(resolve => setTimeout(resolve, 1000));
    return res.json({ message: "Si el correo existe, recibirás un código de recuperación." });
  }

  // Generar OTP de 6 dígitos
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

  // Guardar OTP (Simulado)
  await createResetToken(normalizedEmail, otp, expires);

  const subject = "Código de recuperación de contraseña";
  const text = `Hola,\n\nTu código de recuperación es: ${otp}\n\nEste código expirará en 15 minutos.\n\nSi no solicitaste esto, ignora este correo.`;

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await sendEmail(normalizedEmail, subject, text);
      console.log(`[SIMULATION] Email sent to ${normalizedEmail}`);
    } else {
      console.log(`[SIMULATION] Email sending skipped (No credentials). OTP for ${normalizedEmail}: ${otp}`);
    }
  } catch (error) {
    console.error(`[SIMULATION] Failed to send email to ${normalizedEmail}: ${error.message}`);
  }

  res.json({ message: "Código de recuperación enviado" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email y código son requeridos" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const resetData = await findResetToken(normalizedEmail);

  if (!resetData || resetData.otp !== otp) {
    return res.status(400).json({ message: "Código inválido o expirado" });
  }

  res.json({ ok: true, message: "Código verificado correctamente" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const resetData = await findResetToken(normalizedEmail);

  if (!resetData || resetData.otp !== otp) {
    return res.status(400).json({ message: "Código inválido o expirado" });
  }

  try {
    await updateUserPassword(normalizedEmail, password);
    await deleteResetToken(normalizedEmail);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error actualizando password:", error);
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
};



