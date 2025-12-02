/**
 * Validates a file's type and size.
 * @param {File} file - The file to validate.
 * @returns {string|null} - Returns an error message string if invalid, or null if valid.
 */
export const validateFile = (file) => {
    if (!file) return "No se ha seleccionado ningún archivo.";

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        return "Tipo de archivo no permitido. Solo se permiten PDF, JPG y PNG.";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return "El archivo es demasiado grande. El tamaño máximo permitido es 5MB.";
    }

    return null;
};
