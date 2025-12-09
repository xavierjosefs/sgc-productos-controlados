import toast from 'react-hot-toast';

/**
 * Custom hook wrapper para react-hot-toast
 * Este hook proporciona una forma consistente de mostrar notificaciones de toast en toda la app
 */
export const useToast = () => {
    return {
        success: (message, options = {}) => {
            return toast.success(message, {
                duration: 4000,
                position: 'bottom-right',
                ...options,
            });
        },

        error: (message, options = {}) => {
            return toast.error(message, {
                duration: 5000,
                position: 'bottom-right',
                ...options,
            });
        },

        loading: (message, options = {}) => {
            return toast.loading(message, {
                position: 'bottom-right',
                ...options,
            });
        },

        promise: (promise, messages, options = {}) => {
            return toast.promise(
                promise,
                {
                    loading: messages.loading || 'Cargando...',
                    success: messages.success || 'Completado',
                    error: messages.error || 'Error',
                },
                {
                    position: 'bottom-right',
                    ...options,
                }
            );
        },

        dismiss: (toastId) => {
            toast.dismiss(toastId);
        },
    };
};

// Reusable
export { toast };
