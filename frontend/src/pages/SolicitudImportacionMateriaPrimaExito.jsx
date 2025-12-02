import { useNavigate } from "react-router-dom";

export default function SolicitudImportacionMateriaPrimaExito() {
  const navigate = useNavigate();

  const handleGoToRequests = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#4A8BDF] rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-[#4A8BDF] mb-4">
            ¡Solicitud enviada!
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La solicitud se envió correctamente. Pronto recibirás novedades sobre
            su estado.
          </p>

          {/* Botón */}
          <button
            onClick={handleGoToRequests}
            className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-semibold py-3 px-12 rounded-lg transition-colors duration-200"
          >
            Ir a "Mis Solicitudes"
          </button>
        </div>
      </div>
    </div>
  );
}
