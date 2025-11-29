import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';

export default function SolicitudClaseB2() {
  const navigate = useNavigate();
  const location = useLocation();
  const datosAnterior = location.state?.formData || {};
  
  const [formData, setFormData] = useState({
    // Sustancias Controladas
    categoriaDrogas: [],
    codigoDrogas: '',
    designacionSustancias: '',
    // Administrador/Propietario
    nombreAdmin: '',
    direccion: '',
    cedulaAdmin: '',
    telefonosAdmin: '',
    otroLugarTrabajo: '',
    // Agente Aduanero
    nombreAgente: '',
    direccionAgente: '',
    cedulaAgente: '',
    rncAgente: '',
    telefonosAgente: '',
    otroLugarAgenteTabajo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (category) => {
    setFormData({
      ...formData,
      categoriaDrogas: formData.categoriaDrogas.includes(category)
        ? formData.categoriaDrogas.filter(c => c !== category)
        : [...formData.categoriaDrogas, category],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    
    // Siempre ir a la pantalla 3 ya que pantalla 2 solo aparece con actividades especiales
    navigate('/solicitud-clase-b-3', { state: { formData: { ...datosAnterior, ...formData }, tieneActividadesEspeciales: true, vieneDeP2: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ClientTopbar - Navbar superior */}
      <ClientTopbar />

      {/* Header específico de la página */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/solicitud-clase-b')}
              className="text-gray-400 hover:text-gray-600 text-3xl flex-shrink-0"
            >
              ←
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-blue-600 leading-tight">
                Solicitud de Certificado de Inscripción de Drogas Controladas Clase B<br />
                para Establecimientos Privados
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: Sustancias Controladas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Sustancias Controladas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorías de Drogas Controladas que solicita
                </label>
                <div className="flex gap-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-ii"
                      checked={formData.categoriaDrogas.includes('II')}
                      onChange={() => handleCheckboxChange('II')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="categoria-ii" className="ml-2 text-sm text-gray-700">
                      II
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-iii"
                      checked={formData.categoriaDrogas.includes('III')}
                      onChange={() => handleCheckboxChange('III')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="categoria-iii" className="ml-2 text-sm text-gray-700">
                      III
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-iv"
                      checked={formData.categoriaDrogas.includes('IV')}
                      onChange={() => handleCheckboxChange('IV')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="categoria-iv" className="ml-2 text-sm text-gray-700">
                      IV
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de las Drogas de Categorías II, III y IV
                </label>
                <input
                  type="text"
                  name="codigoDrogas"
                  value={formData.codigoDrogas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desglose de Sustancias Controladas
                </label>
                <input
                  type="text"
                  name="designacionSustancias"
                  value={formData.designacionSustancias}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Administrador/Propietario */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Administrador/Propietario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Administrador / Propietario
                </label>
                <input
                  type="text"
                  name="nombreAdmin"
                  value={formData.nombreAdmin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral
                </label>
                <input
                  type="text"
                  name="cedulaAdmin"
                  value={formData.cedulaAdmin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000-0000000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="text"
                  name="telefonosAdmin"
                  value={formData.telefonosAdmin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  name="otroLugarTrabajo"
                  value={formData.otroLugarTrabajo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Agente Aduanero */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Agente Aduanero</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Agente Aduanero
                </label>
                <input
                  type="text"
                  name="nombreAgente"
                  value={formData.nombreAgente}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccionAgente"
                  value={formData.direccionAgente}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral
                </label>
                <input
                  type="text"
                  name="cedulaAgente"
                  value={formData.cedulaAgente}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000-0000000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  name="rncAgente"
                  value={formData.rncAgente}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="text"
                  name="telefonosAgente"
                  value={formData.telefonosAgente}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  name="otroLugarAgenteTabajo"
                  value={formData.otroLugarAgenteTabajo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-center mb-8">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg w-full"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
