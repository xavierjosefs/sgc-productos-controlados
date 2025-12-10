/**
 * Componentes de Skeleton
 * Componentes reutilizables para mejorar la UX durante la carga de datos
 */

const SkeletonBase = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const SkeletonCard = ({ label = null }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-2">
      {label ? (
        <span className="text-gray-700 text-sm font-medium">{label}</span>
      ) : (
        <SkeletonBase className="h-4 w-24" />
      )}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="text-[#4A8BDF]"
      >
        <path 
          d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <SkeletonBase className="h-12 w-16" />
  </div>
);

export const SkeletonTableRow = ({ columns = 4 }) => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <SkeletonBase className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 5, columns = 4, headers = null }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {headers ? (
            headers.map((header, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))
          ) : (
            Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3 text-left">
                <SkeletonBase className="h-4 w-20" />
              </th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonForm = ({ fields = 4 }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-[620px] mx-auto space-y-4">
    <SkeletonBase className="h-6 w-32 mb-6" />
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <SkeletonBase className="h-4 w-24 mb-2" />
        <SkeletonBase className="h-12 w-full" />
      </div>
    ))}
    <div className="flex gap-4 mt-6 pt-4">
      <SkeletonBase className="h-12 flex-1" />
      <SkeletonBase className="h-12 flex-1" />
    </div>
  </div>
);

export const SkeletonStatsGrid = ({ cards = 3, labels = null }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {Array.from({ length: cards }).map((_, i) => (
      <SkeletonCard key={i} label={labels?.[i]} />
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Resumen General</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <div className="grid grid-cols-2 gap-6">
          {['Total Solicitudes', 'Pendientes', 'Aprobadas', 'Rechazadas', 'Devueltas', 'Total Servicios'].map((label, i) => (
            <SkeletonCard key={i} label={label} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col gap-6">
          {['Total Empleados', 'Activos', 'Inactivos'].map((label, i) => (
            <SkeletonCard key={i} label={label} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonBase;
