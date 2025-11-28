/**
 * Componente Table reutilizable
 * Tabla responsiva con estilos consistentes
 */
export default function Table({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#4A8BDF]">
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-white font-semibold text-sm"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    ${rowIndex % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
                    ${onRowClick ? 'hover:bg-gray-100 cursor-pointer' : ''}
                    transition-colors
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-5 text-sm text-gray-700">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <div 
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${rowIndex % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'}
                  p-4
                  ${onRowClick ? 'cursor-pointer active:bg-gray-100' : ''}
                `}
              >
                <div className="space-y-2">
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">{column.header}</span>
                      <span className="text-sm text-gray-700 text-right">
                        {column.render ? column.render(row) : row[column.accessor]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
