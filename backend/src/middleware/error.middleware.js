import multer from "multer";

export const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                ok: false,
                message: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.',
            });
        }
        return res.status(400).json({
            ok: false,
            message: err.message,
        });
    } else if (err) {
        // Check for custom error from fileFilter
        if (err.message === 'Invalid file type. Only PDF, JPG, and PNG are allowed.') {
            return res.status(400).json({
                ok: false,
                message: 'Tipo de archivo inválido. Solo se permiten PDF, JPG y PNG.',
            });
        }

        console.error("Internal Server Error:", err);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor.",
            error: err.message,
        });
    }
    next();
};
