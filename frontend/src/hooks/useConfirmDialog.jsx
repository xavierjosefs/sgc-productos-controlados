import { useState } from 'react';

/**
 * Custom hook para confirmacion de dialogos
 * Retorna una confirmacion de funcion y un componente ConfirmDialog
 */
export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'warning', // 'warning', 'danger', 'info'
    });
    const [resolvePromise, setResolvePromise] = useState(null);

    const confirm = ({ title, message, confirmText, cancelText, type = 'warning' }) => {
        setConfig({
            title,
            message,
            confirmText: confirmText || 'Confirmar',
            cancelText: cancelText || 'Cancelar',
            type,
        });
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        if (resolvePromise) {
            resolvePromise(true);
        }
        setIsOpen(false);
    };

    const handleCancel = () => {
        if (resolvePromise) {
            resolvePromise(false);
        }
        setIsOpen(false);
    };

    const ConfirmDialog = () => {
        if (!isOpen) return null;

        const typeColors = {
            warning: 'bg-yellow-500 hover:bg-yellow-600',
            danger: 'bg-red-500 hover:bg-red-600',
            info: 'bg-blue-500 hover:bg-blue-600',
        };

        const typeIcons = {
            warning: '⚠️',
            danger: '🗑️',
            info: 'ℹ️',
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">{typeIcons[config.type]}</div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {config.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {config.message}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            {config.cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${typeColors[config.type]}`}
                        >
                            {config.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return { confirm, ConfirmDialog };
};
