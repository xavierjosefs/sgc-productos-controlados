import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeEstado from '../../components/BadgeEstado';

/**
 * Dashboard de Ventanilla
 * Panel para recepción y gestión de solicitudes entrantes
 */
export default function VentanillaDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // TODO: Cargar solicitudes pendientes de recepción
    useEffect(() => {
        // Placeholder - implementar API de ventanilla
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Panel de Ventanilla</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'Ventanilla'}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Solicitudes Recibidas Hoy</span>
                        </div>
                        <p className="text-4xl font-bold text-[#4A8BDF]">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Pendientes de Revisión</span>
                        </div>
                        <p className="text-4xl font-bold text-[#F59E0B]">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Enviadas a Técnico</span>
                        </div>
                        <p className="text-4xl font-bold text-[#10B981]">0</p>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors">
                            Recibir Nueva Solicitud
                        </button>
                        <button className="px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">
                            Buscar Solicitud
                        </button>
                    </div>
                </div>

                {/* Tabla de solicitudes recientes */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Solicitudes Recientes</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Solicitante</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Tipo</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Estado</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Fecha</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No hay solicitudes pendientes
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
