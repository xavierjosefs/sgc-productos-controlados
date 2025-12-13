import React from 'react';

/**
 * RequestTimeline Component - Clean & Minimalist Design
 * Displays the history/timeline of events for a request
 */

// Get simple dot color based on action type
const getDotColor = (accion) => {
    const positive = ['CREACION', 'ENVIO', 'VALIDACION_VENTANILLA', 'VALIDACION_TECNICA', 'APROBACION_DIRECCION'];
    const negative = ['DEVOLUCION_VENTANILLA', 'RECHAZO_DIRECCION', 'DOCUMENTO_ELIMINADO'];

    if (positive.includes(accion)) return 'bg-emerald-500';
    if (negative.includes(accion)) return 'bg-red-400';
    return 'bg-blue-500';
};

// Map role names to display Spanish
const getRolDisplay = (rol) => {
    const roles = {
        'cliente': 'Cliente',
        'ventanilla': 'Ventanilla',
        'tecnico_controlados': 'Técnico',
        'director_controlados': 'Director UPC',
        'direccion': 'Dirección',
        'sistema': 'Sistema'
    };
    return roles[rol] || rol || '';
};

const RequestTimeline = ({ timeline, loading, error }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-sm text-gray-400">Cargando historial...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
                <p className="text-sm text-gray-400">{error}</p>
            </div>
        );
    }

    if (!timeline || timeline.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
                <p className="text-sm text-gray-400">Sin historial disponible</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
            {/* Header */}
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                Historial
            </h3>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-100"></div>

                <div className="space-y-5">
                    {timeline.map((entry, index) => (
                        <div key={entry.id || index} className="relative flex gap-4 group">
                            {/* Dot */}
                            <div className={`relative z-10 w-[11px] h-[11px] rounded-full ${getDotColor(entry.accion)} ring-4 ring-white mt-1.5 flex-shrink-0`}></div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="text-sm font-medium text-gray-800">
                                        {entry.accion_display || entry.accion}
                                    </span>
                                    {entry.rol_usuario && (
                                        <span className="text-xs text-gray-400">
                                            por {entry.usuario_nombre || getRolDisplay(entry.rol_usuario)}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400 mt-0.5">
                                    {entry.fecha_formateada || new Date(entry.fecha_evento).toLocaleString('es-DO', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>

                                {entry.comentario && (
                                    <p className="text-sm text-gray-600 mt-2 pl-3 border-l-2 border-gray-100">
                                        {entry.comentario}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RequestTimeline;
