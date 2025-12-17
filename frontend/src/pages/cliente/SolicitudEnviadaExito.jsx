import React from 'react';
import { useNavigate } from 'react-router-dom';

const SolicitudEnviadaExito = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-start justify-center">
      <div className="max-w-3xl w-full px-6 py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#2B6CB0] mb-12">¡Solicitud enviada!</h1>

        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full border-4 border-[#5393F7] flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="#5393F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-gray-600 mb-6">La solicitud se envió correctamente. Pronto recibirás novedades sobre su estado.</p>

          <button
            onClick={() => navigate('/cliente')}
            className="px-6 py-3 bg-[#0B57A6] text-white rounded-lg font-semibold w-64 hover:bg-[#084c8a]"
          >
            Ir a ¡Mis Solicitudes!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolicitudEnviadaExito;

