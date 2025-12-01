/**
 * Badge de Estado
 * Muestra el estado con color específico
 */
export default function BadgeEstado({ estado }) {
  const statusConfig = {
    'enviada': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Enviada' },
    'aprobada': { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprobada' },
    'devuelta': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Devuelta' },
    'pendiente': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    'rechazada': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada' },
  };

  const config = statusConfig[estado?.toLowerCase()] || statusConfig['pendiente'];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
