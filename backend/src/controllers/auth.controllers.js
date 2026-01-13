import { createUser, findUserByEmail, login, findUserByCedulaWithRole } from "../models/user.client.js";
import { createPendingUser, findPendingByToken, deletePendingUser, deletePendingUserByEmail } from "../models/pending.client.js";
import { createResetToken, findResetToken, deleteResetToken } from "../models/recovery.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { isValidDominicanCedula } from "../utils/validateCedula.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const preRegister = async (req, res) => {
  const { cedula, full_name, email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidDominicanCedula(cedula)) {
    return res.status(400).json({ error: "Cédula inválida." });
  }

  await deletePendingUserByEmail(normalizedEmail);

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ error: "El correo ya está registrado." });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 15).toISOString();

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
  console.log("antes del guardado def")

  await createUser(
    pending.full_name,
    pending.cedula,
    pending.email,
    password,
    pending.role_id
  );

  await deletePendingUser(pending.cedula);

  res.json({ ok: true, message: "Registro completado con éxito" });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user } = await login(email, password);
    const token = jwt.sign({ cedula: user.cedula, role: user.role_id }, process.env.SECRET_KEY, { expiresIn: "8h" })

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

export const getProfile = async (req, res) => {
  try {
    const { cedula } = req.user;

    if (!cedula) {
      return res.status(400).json({ ok: false, message: "Token inválido: no contiene cédula" });
    }

    const user = await findUserByCedulaWithRole(cedula);

    if (!user) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }

    res.json({
      ok: true,
      user
    });
  } catch (error) {
    console.error('[getProfile] Error:', error);
    res.status(500).json({ ok: false, message: "Error al obtener perfil" });
  }
};

/**
 * Request password reset - generates token and sends email
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('[forgotPassword] Step 1: Received email:', email);

    if (!email) {
      return res.status(400).json({ ok: false, message: "El correo es requerido" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('[forgotPassword] Step 2: Normalized email:', normalizedEmail);

    // Check if user exists
    const user = await findUserByEmail(normalizedEmail);
    console.log('[forgotPassword] Step 3: User found:', user ? 'Yes' : 'No');

    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`[forgotPassword] Email not found: ${normalizedEmail}`);
      return res.json({
        ok: true,
        message: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 15).toISOString(); // 15 minutes
    console.log('[forgotPassword] Step 4: Token generated');

    // Save token
    console.log('[forgotPassword] Step 5: Attempting to save token...');
    await createPasswordResetToken(normalizedEmail, token, expires);
    console.log('[forgotPassword] Step 6: Token saved successfully');

    // Send email
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    const subject = "Restablecer tu contraseña";
    const text = `Hola ${user.full_name},\n\nHemos recibido una solicitud para restablecer tu contraseña.\n\nHaz clic en el siguiente enlace para crear una nueva contraseña:\n\n${resetLink}\n\nEste enlace expirará en 15 minutos.\n\nSi no solicitaste este cambio, ignora este correo.`;

    console.log('[forgotPassword] Step 7: Attempting to send email...');
    await sendEmail(normalizedEmail, subject, text);
    console.log('[forgotPassword] Step 8: Email sent successfully');

    console.log(`[forgotPassword] Reset link: ${resetLink}`);

    res.json({
      ok: true,
      message: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
    });

  } catch (error) {
    console.error('[forgotPassword] Error details:', error.message);
    console.error('[forgotPassword] Full error:', error);
    res.status(500).json({ ok: false, message: "Error al procesar la solicitud" });
  }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ ok: false, message: "Token inválido" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ ok: false, message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Find valid token
    const resetToken = await findPasswordResetToken(token);

    if (!resetToken) {
      return res.status(400).json({ ok: false, message: "El enlace ha expirado o es inválido" });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [passwordHash, resetToken.email]
    );

    // Delete used token
    await deletePasswordResetToken(token);

    console.log(`[resetPassword] Password reset successful for: ${resetToken.email}`);

    res.json({ ok: true, message: "Contraseña actualizada exitosamente" });

  } catch (error) {
    console.error('[resetPassword] Error:', error);
    res.status(500).json({ ok: false, message: "Error al restablecer la contraseña" });
  }
};
