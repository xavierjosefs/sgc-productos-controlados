/**
 * Mapea el ID del rol a un nombre legible.
 * @param {number} roleId
 * @returns {string} Nombre del rol
 */
export const getRoleName = (roleId) => {
    switch (roleId) {
        case 1:
            return 'Administrador';
        case 2:
            return 'Usuario';
        case 3:
            return 'Supervisor';
        default:
            return 'Usuario';
    }
};
