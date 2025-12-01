/**
 * Card de Resumen de Estado
 * Muestra cantidad de solicitudes por estado
 */
export default function RequestSummaryCard({ title, count, color = '#4A8BDF' }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
      {/* Contenido */}
      <p className="text-gray-700 text-sm font-medium mb-2">{title}</p>
      <p className="text-4xl font-bold" style={{ color }}>
        {count}
      </p>
    </div>
  );
}
