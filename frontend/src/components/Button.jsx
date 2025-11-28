/**
 * Componente Button reutilizable
 * Soporta diferentes variantes y tamaños
 */
export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#4A8BDF] text-white hover:bg-[#3875C8] focus:ring-[#4A8BDF]',
    secondary: 'bg-[#085297] text-white hover:bg-[#064175] focus:ring-[#085297]',
    outline: 'border-2 border-[#4A8BDF] text-[#4A8BDF] hover:bg-[#4A8BDF] hover:text-white focus:ring-[#4A8BDF]',
    light: 'bg-[#E3F2FD] text-[#4A8BDF] hover:bg-[#BBDEFB] focus:ring-[#4A8BDF]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    success: 'bg-[#10B981] text-white hover:bg-[#059669] focus:ring-[#10B981]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-current';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
