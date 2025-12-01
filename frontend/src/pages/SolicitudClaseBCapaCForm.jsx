import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";

export default function SolicitudClaseBCapaCForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useSolicitudClaseBCapaC();

  const [categoriasSustancias, setCategoriasSustancias] = useState(
    formData.categoriasSustancias || []
  );
  const [codigoGrupo, setCodigoGrupo] = useState(formData.codigoGrupo || "");
  const [designacionSustancias, setDesignacionSustancias] = useState(
    formData.designacionSustancias || ""
  );

  // Administrador/Propietario
  const [nombreAdministrador, setNombreAdministrador] = useState(
    formData.nombreAdministrador || ""
  );
  const [direccionAdministrador, setDireccionAdministrador] = useState(
    formData.direccionAdministrador || ""
  );
  const [cedulaAdministrador, setCedulaAdministrador] = useState(
    formData.cedulaAdministrador || ""
  );
  const [rnc, setRnc] = useState(formData.rnc || "");
  const [telefonoAdministrador, setTelefonoAdministrador] = useState(
    formData.telefonoAdministrador || ""
  );
  const [lugarTrabajoAdministrador, setLugarTrabajoAdministrador] = useState(
    formData.lugarTrabajoAdministrador || ""
  );

  // Agente Aduanero
  const [nombreAgenteAduanero, setNombreAgenteAduanero] = useState(
    formData.nombreAgenteAduanero || ""
  );
  const [direccionAgenteAduanero, setDireccionAgenteAduanero] = useState(
    formData.direccionAgenteAduanero || ""
  );
  const [cedulaAgenteAduanero, setCedulaAgenteAduanero] = useState(
    formData.cedulaAgenteAduanero || ""
  );
  const [rnc2, setRnc2] = useState(formData.rnc2 || "");
  const [telefonoAgenteAduanero, setTelefonoAgenteAduanero] = useState(
    formData.telefonoAgenteAduanero || ""
  );
  const [lugarTrabajoAgenteAduanero, setLugarTrabajoAgenteAduanero] = useState(
    formData.lugarTrabajoAgenteAduanero || ""
  );

  const handleCategoriaChange = (categoria) => {
    setCategoriasSustancias((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (categoriasSustancias.length === 0) {
      alert("Debe seleccionar al menos una categoría de sustancias controladas");
      return;
    }

    if (!codigoGrupo.trim()) {
      alert("El código del grupo es requerido");
      return;
    }

    if (!designacionSustancias.trim()) {
      alert("La designación de sustancias es requerida");
      return;
    }

    if (!nombreAdministrador.trim()) {
      alert("El nombre del administrador/propietario es requerido");
      return;
    }

    if (!direccionAdministrador.trim()) {
      alert("La dirección del administrador/propietario es requerida");
      return;
    }

    if (!cedulaAdministrador.trim()) {
      alert("La cédula del administrador/propietario es requerida");
      return;
    }

    if (!nombreAgenteAduanero.trim()) {
      alert("El nombre del agente aduanero es requerido");
      return;
    }

    if (!direccionAgenteAduanero.trim()) {
      alert("La dirección del agente aduanero es requerida");
      return;
    }

    if (!cedulaAgenteAduanero.trim()) {
      alert("La cédula del agente aduanero es requerida");
      return;
    }

    // Guardar datos en el contexto
    updateFormData({
      categoriasSustancias,
      codigoGrupo,
      designacionSustancias,
      nombreAdministrador,
      direccionAdministrador,
      cedulaAdministrador,
      rnc,
      telefonoAdministrador,
      lugarTrabajoAdministrador,
      nombreAgenteAduanero,
      direccionAgenteAduanero,
      cedulaAgenteAduanero,
      rnc2,
      telefonoAgenteAduanero,
      lugarTrabajoAgenteAduanero,
    });

    // Navegar a documentos
    navigate("/solicitud-drogas-clase-b-capa-c/documentos");
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
          {/* Sustancias Controladas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Sustancias Controladas
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorías de drogas controladas que solicita
                </label>
                <div className="flex flex-wrap gap-4">
                  {["II", "III", "IV"].map((categoria) => (
                    <label
                      key={categoria}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={categoriasSustancias.includes(categoria)}
                        onChange={() => handleCategoriaChange(categoria)}
                        className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                      />
                      <span className="text-sm text-gray-700">{categoria}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de los Grupos de Complejidad II y IV
                </label>
                <input
                  type="text"
                  value={codigoGrupo}
                  onChange={(e) => setCodigoGrupo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Ingrese el código"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designación de Sustancias Controladas
                </label>
                <textarea
                  value={designacionSustancias}
                  onChange={(e) => setDesignacionSustancias(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Describa las sustancias"
                />
              </div>
            </div>
          </div>

          {/* Administrador/Propietario */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Administrador/Propietario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Administrador / Propietario
                </label>
                <input
                  type="text"
                  value={nombreAdministrador}
                  onChange={(e) => setNombreAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionAdministrador}
                  onChange={(e) => setDireccionAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Dirección completa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral
                </label>
                <input
                  type="text"
                  value={cedulaAdministrador}
                  onChange={(e) =>
                    setCedulaAdministrador(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-0000000-0"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  value={rnc}
                  onChange={(e) => setRnc(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-00000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="tel"
                  value={telefonoAdministrador}
                  onChange={(e) => setTelefonoAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="809-000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={lugarTrabajoAdministrador}
                  onChange={(e) => setLugarTrabajoAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Lugar de trabajo"
                />
              </div>
            </div>
          </div>

          {/* Agente Aduanero */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Agente Aduanero
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Agente Aduanero
                </label>
                <input
                  type="text"
                  value={nombreAgenteAduanero}
                  onChange={(e) => setNombreAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionAgenteAduanero}
                  onChange={(e) => setDireccionAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Dirección completa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral
                </label>
                <input
                  type="text"
                  value={cedulaAgenteAduanero}
                  onChange={(e) =>
                    setCedulaAgenteAduanero(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-0000000-0"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  value={rnc2}
                  onChange={(e) => setRnc2(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-00000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="tel"
                  value={telefonoAgenteAduanero}
                  onChange={(e) => setTelefonoAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="809-000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={lugarTrabajoAgenteAduanero}
                  onChange={(e) => setLugarTrabajoAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Lugar de trabajo"
                />
              </div>
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
