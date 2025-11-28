/**
 * Componente FileUpload reutilizable
 * Para cargar archivos con validación
 */
import { useRef } from 'react';

export default function FileUpload({ 
  label,
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSize = 5, // MB
  onChange,
  error,
  helperText,
  fileName,
  disabled = false,
  className = ''
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`El archivo es muy grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }

    onChange?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`
            px-4 py-2 border-2 border-[#4A8BDF] text-[#4A8BDF] rounded-lg
            font-medium hover:bg-[#4A8BDF] hover:text-white
            transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          Seleccionar Archivo
        </button>
        
        {fileName && (
          <span className="text-sm text-gray-600 truncate flex-1">
            {fileName}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
