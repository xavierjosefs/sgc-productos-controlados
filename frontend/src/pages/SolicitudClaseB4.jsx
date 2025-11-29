import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';

export default function SolicitudClaseB4() {
  const navigate = useNavigate();
  const location = useLocation();
  const datosFormulario = location.state?.formData || {};
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEnviar = () => {
    setMostrarModal(true);
  };

  const handleConfirmarEnvio = () => {
    console.log('Solicitud enviada:', datosFormulario);
    setMostrarModal(false);
    // Navegar a la pantalla de éxito
    navigate('/solicitud-clase-b-5');
  };

  const handleCancelar = () => {
    setMostrarModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ClientTopbar - Navbar superior */}
      <ClientTopbar />

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form className="space-y-6">
          {/* SECCIÓN: Resumen de Solicitud */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Resumen de Solicitud</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-medium">Su solicitud ha sido procesada correctamente.</span>
              </p>
              <p>
                Por favor, revise los datos ingresados y haga clic en "Enviar" para completar el trámite.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => navigate('/solicitud-clase-b-3', { state: { formData: datosFormulario } })}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-lg"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleEnviar}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h2 className="text-blue-600 font-bold text-lg mb-4">Confirmación de Envío</h2>
            <p className="text-gray-700 text-sm mb-2">
              ¿Está seguro de que desea enviar esta solicitud?
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Una vez enviada, no podrá ser editada.
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCancelar}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEnvio}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
