import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../../components/ClientTopbar';

export default function SolicitudClaseB5() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          {/* Título de éxito */}
          <h2 className="text-4xl font-bold text-[#4A8BDF] mb-8">
            ¡Solicitud enviada!
          </h2>

          {/* Icono de checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[#4A8BDF] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <p className="text-gray-700 text-base mb-8 leading-relaxed">
            La solicitud se envió correctamente. Pronto recibirás novedades sobre<br />
            su estado.
          </p>

          {/* Botón para ir a Mis Solicitudes */}
          <button
            onClick={() => navigate('/')}
            className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-semibold py-3 px-12 rounded-lg inline-block transition-colors duration-200"
          >
            Ir a "Mis Solicitudes"
          </button>
        </div>
      </div>
    </div>
  );
}

