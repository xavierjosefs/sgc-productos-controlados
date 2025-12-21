import { useState, useMemo, useCallback } from 'react';

/**
 * Hook para añadir ordenamiento a las tablas
 * @param {Array} data - Array de datos a ordenar
 * @param {Object} defaultSort - { key: string, direction: 'asc' | 'desc' }
 * @returns {Object} - { sortedData, sortConfig, requestSort, getSortIcon }
 */
export default function useSortableTable(data, defaultSort = { key: 'id', direction: 'desc' }) {
    const [sortConfig, setSortConfig] = useState(defaultSort);

    // Ordenar los datos
    const sortedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const sortableData = [...data];

        sortableData.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Manejar valores null/undefined
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';

            // Manejar fechas
            if (sortConfig.key.includes('fecha') || sortConfig.key.includes('date')) {
                aValue = new Date(aValue).getTime() || 0;
                bValue = new Date(bValue).getTime() || 0;
            }
            // Manejar números (incluyendo IDs)
            else if (typeof aValue === 'number' || (typeof aValue === 'string' && !isNaN(aValue))) {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
            // Manejar strings
            else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sortableData;
    }, [data, sortConfig]);

    // Función para cambiar el ordenamiento
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key) {
                // Alternar dirección si es la misma columna
                return {
                    key,
                    direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
                };
            }
            // Nueva columna, ordenar ascendente por defecto (o descendente para IDs/fechas)
            const defaultDirection = key.includes('fecha') || key === 'id' ? 'desc' : 'asc';
            return { key, direction: defaultDirection };
        });
    }, []);

    // Componente de icono de ordenamiento
    const SortIcon = useCallback(({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            // Icono neutral (no ordenado por esta columna)
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 opacity-40 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            );
        }

        if (sortConfig.direction === 'asc') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            );
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        );
    }, [sortConfig]);

    // Función helper para crear header de columna ordenable
    const SortableHeader = useCallback(({ columnKey, children, className = '' }) => {
        return (
            <button
                type="button"
                onClick={() => requestSort(columnKey)}
                className={`flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${className}`}
            >
                {children}
                <SortIcon columnKey={columnKey} />
            </button>
        );
    }, [requestSort, SortIcon]);

    return {
        sortedData,
        sortConfig,
        requestSort,
        SortIcon,
        SortableHeader
    };
}
