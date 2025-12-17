import React, { useState } from 'react';

const ModalRechazo = ({ open, onClose, onSubmit, loading }) => {
    const [reasons, setReasons] = useState('');

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(reasons);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
                <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold">Confirmar Rechazo de Solicitud</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <p className="text-gray-700 mb-2">
                            Esta solictud cambiará al estado <strong>Devuelto</strong> y se notificará al usuario.
                        </p>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Razones del incumplimiento (se enviarán por correo)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[150px]"
                            placeholder="Indique los documentos faltantes o correcciones necesarias..."
                            value={reasons}
                            onChange={(e) => setReasons(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                'Confirmar Rechazo'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRechazo;
