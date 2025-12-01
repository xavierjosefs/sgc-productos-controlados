import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import { useSolicitudClaseB } from '../contexts/SolicitudClaseBContext';

export default function SolicitudClaseB2() {
  const navigate = useNavigate();
  const { formData: contextData, updateFormData } = useSolicitudClaseB();
  
  const [form, setForm] = useState({
    // Sustancias Controladas
    categoriaDrogas: contextData.categoriaDrogas || [],
    codigoDrogas: contextData.codigoDrogas || '',
    designacionSustancias: contextData.designacionSustancias || '',
    // Administrador/Propietario
    nombreAdmin: contextData.nombreAdmin || '',
    direccionAdmin: contextData.direccionAdmin || '',
    cedulaAdmin: contextData.cedulaAdmin || '',
    telefonosAdmin: contextData.telefonosAdmin || '',
    otroLugarTrabajoAdmin: contextData.otroLugarTrabajoAdmin || '',
    // Agente Aduanero
    nombreAgente: contextData.nombreAgente || '',
    direccionAgente: contextData.direccionAgente || '',
    cedulaAgente: contextData.cedulaAgente || '',
    rncAgente: contextData.rncAgente || '',
    telefonosAgente: contextData.telefonosAgente || '',
    otroLugarTrabajoAgente: contextData.otroLugarTrabajoAgente || '',
  });

  // Verificar que venimos de página 1 con actividades especiales
  useEffect(() => {
    const { importadora, exportadora, fabricante } = contextData.actividades || {};
    const tieneActividadesEspeciales = importadora || exportadora || fabricante;
    
    if (!tieneActividadesEspeciales) {
      // Si no tiene actividades especiales, redirigir a página 1
      navigate('/solicitud-drogas-clase-b', { replace: true });
    }
  }, [contextData.actividades, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category) => {
    setForm(prev => ({
      ...prev,
      categoriaDrogas: prev.categoriaDrogas.includes(category)
        ? prev.categoriaDrogas.filter(c => c !== category)
        : [...prev.categoriaDrogas, category],
    }));
  };

  // Validaciones
  const errors = (() => {
    const out = {};
    
    // Sustancias Controladas
    if (form.categoriaDrogas.length === 0) {
      out.categoriaDrogas = 'Selecciona al menos una categoría';
    }
    
    if (!form.codigoDrogas?.trim()) out.codigoDrogas = 'Este campo es obligatorio';
    if (!form.designacionSustancias?.trim()) out.designacionSustancias = 'Este campo es obligatorio';
    
    // Administrador/Propietario
    if (!form.nombreAdmin?.trim()) out.nombreAdmin = 'Este campo es obligatorio';
    if (!form.direccionAdmin?.trim()) out.direccionAdmin = 'Este campo es obligatorio';
    if (!form.cedulaAdmin?.trim()) out.cedulaAdmin = 'Este campo es obligatorio';
    
    if (form.cedulaAdmin && !(/^\d{3}-\d{7}-\d{1}$/.test(form.cedulaAdmin) || /^\d{11}$/.test(form.cedulaAdmin))) {
      out.cedulaAdmin = 'Formato de cédula inválido (ej: 000-0000000-0)';
    }
    
    if (!form.telefonosAdmin?.trim()) out.telefonosAdmin = 'Este campo es obligatorio';
    
    // Agente Aduanero
    if (!form.nombreAgente?.trim()) out.nombreAgente = 'Este campo es obligatorio';
    if (!form.direccionAgente?.trim()) out.direccionAgente = 'Este campo es obligatorio';
    if (!form.cedulaAgente?.trim()) out.cedulaAgente = 'Este campo es obligatorio';
    
    if (form.cedulaAgente && !(/^\d{3}-\d{7}-\d{1}$/.test(form.cedulaAgente) || /^\d{11}$/.test(form.cedulaAgente))) {
      out.cedulaAgente = 'Formato de cédula inválido (ej: 000-0000000-0)';
    }
    
    if (!form.rncAgente?.trim()) out.rncAgente = 'Este campo es obligatorio';
    if (!form.telefonosAgente?.trim()) out.telefonosAgente = 'Este campo es obligatorio';
    
    return out;
  })();

  const isValid = Object.keys(errors).length === 0;

  const handleBack = () => {
    navigate('/solicitud-drogas-clase-b');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValid) {
      alert('Por favor, completa todos los campos requeridos correctamente');
      return;
    }
    
    // Guardar datos en el Context
    updateFormData(form);
    
    // Navegar a página 3
    navigate('/solicitud-drogas-clase-b/documentos');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ClientTopbar - Navbar superior */}
      <ClientTopbar />

      {/* Header específico de la página */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="text-[#4A8BDF] mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">Solicitud de Certificado de Inscripción de Drogas Controladas Clase B</h1>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* SECCIÓN 1: Sustancias Controladas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Sustancias Controladas *</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorías de Drogas Controladas que solicita *
                </label>
                <div className="flex gap-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-ii"
                      checked={form.categoriaDrogas.includes('II')}
                      onChange={() => handleCheckboxChange('II')}
                      className="w-4 h-4 text-[#4A8BDF] rounded focus:ring-[#4A8BDF]"
                    />
                    <label htmlFor="categoria-ii" className="ml-2 text-sm text-gray-700">
                      II
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-iii"
                      checked={form.categoriaDrogas.includes('III')}
                      onChange={() => handleCheckboxChange('III')}
                      className="w-4 h-4 text-[#4A8BDF] rounded focus:ring-[#4A8BDF]"
                    />
                    <label htmlFor="categoria-iii" className="ml-2 text-sm text-gray-700">
                      III
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="categoria-iv"
                      checked={form.categoriaDrogas.includes('IV')}
                      onChange={() => handleCheckboxChange('IV')}
                      className="w-4 h-4 text-[#4A8BDF] rounded focus:ring-[#4A8BDF]"
                    />
                    <label htmlFor="categoria-iv" className="ml-2 text-sm text-gray-700">
                      IV
                    </label>
                  </div>
                </div>
                {errors.categoriaDrogas && <p className="text-xs text-red-500 mt-1">{errors.categoriaDrogas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de las Drogas de Categorías II, III y IV *
                </label>
                <input
                  type="text"
                  name="codigoDrogas"
                  value={form.codigoDrogas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.codigoDrogas && <p className="text-xs text-red-500 mt-1">{errors.codigoDrogas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desglose de Sustancias Controladas *
                </label>
                <input
                  type="text"
                  name="designacionSustancias"
                  value={form.designacionSustancias}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.designacionSustancias && <p className="text-xs text-red-500 mt-1">{errors.designacionSustancias}</p>}
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Administrador/Propietario */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Administrador/Propietario *</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Administrador / Propietario *
                </label>
                <input
                  type="text"
                  name="nombreAdmin"
                  value={form.nombreAdmin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.nombreAdmin && <p className="text-xs text-red-500 mt-1">{errors.nombreAdmin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccionAdmin"
                  value={form.direccionAdmin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.direccionAdmin && <p className="text-xs text-red-500 mt-1">{errors.direccionAdmin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral *
                </label>
                <input
                  type="text"
                  name="cedulaAdmin"
                  value={form.cedulaAdmin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder="000-0000000-0"
                  required
                />
                {errors.cedulaAdmin && <p className="text-xs text-red-500 mt-1">{errors.cedulaAdmin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s) *
                </label>
                <input
                  type="text"
                  name="telefonosAdmin"
                  value={form.telefonosAdmin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.telefonosAdmin && <p className="text-xs text-red-500 mt-1">{errors.telefonosAdmin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  name="otroLugarTrabajoAdmin"
                  value={form.otroLugarTrabajoAdmin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Agente Aduanero */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Agente Aduanero *</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Agente Aduanero *
                </label>
                <input
                  type="text"
                  name="nombreAgente"
                  value={form.nombreAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.nombreAgente && <p className="text-xs text-red-500 mt-1">{errors.nombreAgente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccionAgente"
                  value={form.direccionAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.direccionAgente && <p className="text-xs text-red-500 mt-1">{errors.direccionAgente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral *
                </label>
                <input
                  type="text"
                  name="cedulaAgente"
                  value={form.cedulaAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder="000-0000000-0"
                  required
                />
                {errors.cedulaAgente && <p className="text-xs text-red-500 mt-1">{errors.cedulaAgente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC *
                </label>
                <input
                  type="text"
                  name="rncAgente"
                  value={form.rncAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.rncAgente && <p className="text-xs text-red-500 mt-1">{errors.rncAgente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s) *
                </label>
                <input
                  type="text"
                  name="telefonosAgente"
                  value={form.telefonosAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.telefonosAgente && <p className="text-xs text-red-500 mt-1">{errors.telefonosAgente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  name="otroLugarTrabajoAgente"
                  value={form.otroLugarTrabajoAgente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className="bg-[#0B57A6] hover:bg-[#084c8a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
