/**
 * Card de Resumen de Estado
 * Muestra cantidad de solicitudes por estado
 */
export default function RequestSummaryCard({ title, count, color = '#4A8BDF', onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Contenido */}
      <p className="text-gray-700 text-sm font-medium mb-2">{title}</p>
      <p className="text-4xl font-bold" style={{ color }}>
        {count}
      </p>

      {/* Ícono de enlace */}
      <div className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </div>
  );
}
