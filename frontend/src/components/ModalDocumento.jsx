import React, { useState } from 'react';

/**
 * Modal para subir o reemplazar documento
 * Props:
 * - open: boolean
 * - onClose: function
 * - onSubmit: function(requestId, file)
 * - requestId: string
 * - isReplace: boolean (true para reemplazar, false para subir)
 * - initialDocument: objeto documento (opcional)
 */
const ModalDocumento = ({ open, onClose, onSubmit, requestId, isReplace = false, initialDocument }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    // Validar tipo
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(selected.type)) {
      setError('Solo se permiten archivos PDF, PNG o JPG');
      setFile(null);
      return;
    }
    // Validar tamaño (máx 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError('El archivo excede el tamaño máximo de 5MB');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Debes seleccionar un archivo válido');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(requestId, file, initialDocument?.id);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Error al subir el documento');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{isReplace ? 'Reemplazar documento' : 'Subir documento'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Seleccionar archivo</label>
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={handleFileChange} 
              disabled={loading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {file && <p className="text-xs text-green-600 mt-2">✓ {file.name}</p>}
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || !file}
              className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3a7bcf] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subiendo...' : isReplace ? 'Reemplazar' : 'Subir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDocumento;
