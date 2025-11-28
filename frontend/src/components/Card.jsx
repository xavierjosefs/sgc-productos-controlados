/**
 * Componente Card reutilizable
 * Contenedor con estilos consistentes
 */
export default function Card({ 
  children, 
  className = '',
  padding = true,
  hover = false,
  ...props 
}) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
