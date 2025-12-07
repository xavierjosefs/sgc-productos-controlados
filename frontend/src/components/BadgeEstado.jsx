/**
 * Badge de Estado
 * Muestra el estado con color específico y mejor visibilidad
 */
export default function BadgeEstado({ estado }) {
  const statusConfig = {
    // Estados reales de la BD con colores más visibles
    'pendiente': { 
      bg: 'bg-gray-200', 
      text: 'text-gray-800', 
      label: 'Pendiente'
    },
    'en revisión por vus': { 
      bg: 'bg-blue-500', 
      text: 'text-white', 
      label: 'En Revisión'
    },
    'devuelta por vus': { 
      bg: 'bg-orange-500', 
      text: 'text-white', 
      label: 'Devuelta'
    },
    'en evaluación técnica': { 
      bg: 'bg-purple-500', 
      text: 'text-white', 
      label: 'En Evaluación Técnica'
    },
    'devuelta por dirección': { 
      bg: 'bg-red-500', 
      text: 'text-white', 
      label: 'Devuelta por Dirección'
    },
    'aprobada por upc': { 
      bg: 'bg-green-500', 
      text: 'text-white', 
      label: 'Aprobada por UPC'
    },
    'firmada por dirección': { 
      bg: 'bg-emerald-600', 
      text: 'text-white', 
      label: 'Firmada'
    },
    'en revisión dncd': { 
      bg: 'bg-indigo-500', 
      text: 'text-white', 
      label: 'En Revisión DNCD'
    },
    'autorizada dncd': { 
      bg: 'bg-teal-500', 
      text: 'text-white', 
      label: 'Autorizada DNCD'
    },
    'finalizada': { 
      bg: 'bg-green-600', 
      text: 'text-white', 
      label: 'Finalizada'
    },
    'rechazada': { 
      bg: 'bg-red-600', 
      text: 'text-white', 
      label: 'Rechazada'
    },
    'enviada': { 
      bg: 'bg-blue-500', 
      text: 'text-white', 
      label: 'Enviada'
    },
    
    // Alias para compatibilidad
    'borrador': { 
      bg: 'bg-gray-400', 
      text: 'text-white', 
      label: 'Borrador'
    },
  };

  const config = statusConfig[estado?.toLowerCase()] || { 
    bg: 'bg-gray-300', 
    text: 'text-gray-800', 
    label: estado || 'Sin estado'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} shadow-sm`}>
      <span>{config.label}</span>
    </span>
  );
}
