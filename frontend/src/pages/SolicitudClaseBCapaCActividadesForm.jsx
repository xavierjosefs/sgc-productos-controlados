import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";

export default function SolicitudClaseBCapaCActividadesForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useSolicitudClaseBCapaC();

  const [actividades, setActividades] = useState(formData.actividades || []);

  const handleActividadChange = (actividad) => {
    setActividades((prev) => {
      if (prev.includes(actividad)) {
        return prev.filter((a) => a !== actividad);
      } else {
        return [...prev, actividad];
      }
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardar datos en el contexto
    updateFormData({
      actividades,
    });

    // Verificar si marcaron alguna actividad especial
    const actividadesEspeciales = ["Importadora", "Exportadora", "Fabricante"];
    const tieneActividadEspecial = actividades.some((act) =>
      actividadesEspeciales.includes(act)
    );

    // Si marcaron alguna actividad especial, ir a paso 2
    // Si no, ir directo a documentos
    if (tieneActividadEspecial) {
      navigate("/solicitud-drogas-clase-b-capa-c/paso-2");
    } else {
      navigate("/solicitud-drogas-clase-b-capa-c/documentos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">
            Solicitud de Certificado de Inscripción de Drogas Controladas Clase B
            para Hospitales Públicos y/u otras Instituciones Públicas
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Actividades */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Actividades
            </h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Importadora")}
                  onChange={() => handleActividadChange("Importadora")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Importadora</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Exportadora")}
                  onChange={() => handleActividadChange("Exportadora")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Exportadora</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Fabricante")}
                  onChange={() => handleActividadChange("Fabricante")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Fabricante</span>
              </label>
            </div>
          </div>

          {/* Botón de Continuar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
