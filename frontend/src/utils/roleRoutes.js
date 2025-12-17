/**
 * Role-based routing configuration
 * Maps role names to their dashboard URLs
 */

export const ROLE_ROUTES = {
    cliente: '/cliente',
    ventanilla: '/ventanilla',
    tecnico_controlados: '/tecnico-controlados',
    director_controlados: '/director-tecnico',
    director_tecnico: '/director-tecnico',
    direccion: '/direccion',
    dncd: '/dncd',
    admin: '/admin',
};

/**
 * Get the home path for a given role
 * @param {string} roleName - The role name from database
 * @returns {string} The dashboard URL for that role
 */
export const getRoleHomePath = (roleName) => {
    return ROLE_ROUTES[roleName] || '/cliente';
};

/**
 * Check if a user has access to a specific route based on their role
 * @param {string} userRole - The user's role
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @returns {boolean} Whether the user has access
 */
export const hasRoleAccess = (userRole, allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) {
        return true; // No restrictions
    }
    return allowedRoles.includes(userRole);
};

/**
 * Get display name for a role
 * @param {string} roleName - The role name from database
 * @returns {string} Human-readable role name
 */
export const getRoleDisplayName = (roleName) => {
    const displayNames = {
        cliente: 'Cliente',
        ventanilla: 'Ventanilla',
        tecnico_controlados: 'Técnico de Controlados',
        director_controlados: 'Director Técnico',
        director_tecnico: 'Director Técnico',
        direccion: 'Dirección',
        dncd: 'DNCD',
        admin: 'Administrador',
    };
    return displayNames[roleName] || roleName;
};
