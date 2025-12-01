import React from 'react';

const ModalConfirmacionEnvio = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <h3 className="text-center text-lg font-semibold text-[#2B6CB0] mb-3">Confirmación de Envío</h3>
        <p className="text-center text-sm text-gray-600 mb-6">┬┐Est├í seguro de que desea enviar esta solicitud?<br />Una vez enviada, no podr├í ser editada.</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-md bg-[#A9CCE8] text-white font-medium hover:bg-[#93b6df]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-md bg-[#0B57A6] text-white font-medium hover:bg-[#084c8a]"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEnvio;
