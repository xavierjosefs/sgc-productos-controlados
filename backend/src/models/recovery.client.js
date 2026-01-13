// Simulación de base de datos en memoria para tokens de recuperación
const resetTokens = new Map();

export const createResetToken = async (email, token, expires) => {
    resetTokens.set(token, { email, expires });
    console.log(`[SIMULATION] Token created for ${email}: ${token}`);
    return { email, token, expires };
};

export const findResetToken = async (token) => {
    const data = resetTokens.get(token);
    if (!data) return null;

    // Verificar expiración
    if (new Date() > data.expires) {
        resetTokens.delete(token);
        return null;
    }

    return { token, ...data };
};

export const deleteResetToken = async (token) => {
    resetTokens.delete(token);
    console.log(`[SIMULATION] Token deleted: ${token}`);
};
