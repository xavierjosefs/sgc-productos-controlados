import React from 'react';

const ModalConfirmacionEliminar = ({ open, onCancel, onConfirm, documentName, loading }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
                <h3 className="text-center text-lg font-semibold text-red-600 mb-3">
                    ⚠️ Confirmar Eliminación
                </h3>
                <p className="text-center text-sm text-gray-600 mb-2">
                    ¿Está seguro de que desea eliminar el siguiente documento?
                </p>
                <p className="text-center text-sm font-semibold text-gray-900 mb-4">
                    "{documentName}"
                </p>
                <p className="text-center text-xs text-red-500 mb-6">
                    Esta acción no se puede deshacer.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-6 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacionEliminar;
