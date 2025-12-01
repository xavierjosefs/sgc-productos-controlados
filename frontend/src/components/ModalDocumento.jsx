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
    if (selectedFile.size > 5 * 1024 * 1024) {
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
      setError('Debes seleccionar un archivo v├ílido');
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
    <div className="modal-documento-overlay">
      <div className="modal-documento">
        <h3>{isReplace ? 'Reemplazar documento' : 'Subir documento'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} disabled={loading} />
          {error && <div className="modal-documento-error">{error}</div>}
          <div className="modal-documento-actions">
            <button type="button" onClick={onClose} disabled={loading} className="cancelar-btn">Cancelar</button>
            <button type="submit" disabled={loading || !file} className="subir-btn">
              {loading ? 'Subiendo...' : isReplace ? 'Reemplazar' : 'Subir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDocumento;
