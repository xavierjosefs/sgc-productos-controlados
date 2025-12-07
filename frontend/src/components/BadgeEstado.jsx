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
      label: 'Pendiente',
      icon: '⏳'
    },
    'en revisión por vus': { 
      bg: 'bg-blue-500', 
      text: 'text-white', 
      label: 'En Revisión',
      icon: '👀'
    },
    'devuelta por vus': { 
      bg: 'bg-orange-500', 
      text: 'text-white', 
      label: 'Devuelta',
      icon: '↩️'
    },
    'en evaluación técnica': { 
      bg: 'bg-purple-500', 
      text: 'text-white', 
      label: 'En Evaluación Técnica',
      icon: '🔬'
    },
    'devuelta por dirección': { 
      bg: 'bg-red-500', 
      text: 'text-white', 
      label: 'Devuelta por Dirección',
      icon: '↩️'
    },
    'aprobada por upc': { 
      bg: 'bg-green-500', 
      text: 'text-white', 
      label: 'Aprobada por UPC',
      icon: '✓'
    },
    'firmada por dirección': { 
      bg: 'bg-emerald-600', 
      text: 'text-white', 
      label: 'Firmada',
      icon: '✍️'
    },
    'en revisión dncd': { 
      bg: 'bg-indigo-500', 
      text: 'text-white', 
      label: 'En Revisión DNCD',
      icon: '👁️'
    },
    'autorizada dncd': { 
      bg: 'bg-teal-500', 
      text: 'text-white', 
      label: 'Autorizada DNCD',
      icon: '✓'
    },
    'finalizada': { 
      bg: 'bg-green-600', 
      text: 'text-white', 
      label: 'Finalizada',
      icon: '✓'
    },
    'rechazada': { 
      bg: 'bg-red-600', 
      text: 'text-white', 
      label: 'Rechazada',
      icon: '✗'
    },
    'enviada': { 
      bg: 'bg-blue-500', 
      text: 'text-white', 
      label: 'Enviada',
      icon: '📤'
    },
    
    // Alias para compatibilidad
    'borrador': { 
      bg: 'bg-gray-400', 
      text: 'text-white', 
      label: 'Borrador',
      icon: '📝'
    },
  };

  const config = statusConfig[estado?.toLowerCase()] || { 
    bg: 'bg-gray-300', 
    text: 'text-gray-800', 
    label: estado || 'Sin estado',
    icon: '•'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} shadow-sm`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
