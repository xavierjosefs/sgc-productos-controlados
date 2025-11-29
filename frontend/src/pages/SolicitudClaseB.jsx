import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';

export default function SolicitudClaseB() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Identificación
    nombreEmpresa: '',
    ruc: '',
    rif: '',
    telefono: '',
    correoElectronico: '',
    // Actividades
    actividades: {
      importadora: false,
      exportadora: false,
      fabricante: false,
      distribuidor: false,
      laboratorioAnalitico: false,
      farmacia: false,
      clinicaPrivada: false,
      clinicaVeterinaria: false,
      institucionEnsenanza: false,
      hospitalPublico: false,
      investigacion: false,
      otra: '',
    },
    // Condición
    condicion: '',
    // Regente Farmacéutico
    nombreRegente: '',
    descripcion: '',
    cedulaRegente: '',
    profesión: '',
    cedulaDelRegistro: '',
    // Pago
    datosFactura: '',
    montoFactura: '',
    creditoDelFacturador: '',
  });

  const actividades = [
    { key: 'importadora', label: 'Importadora' },
    { key: 'exportadora', label: 'Exportadora' },
    { key: 'fabricante', label: 'Fabricante' },
    { key: 'distribuidor', label: 'Distribuidor' },
    { key: 'laboratorioAnalitico', label: 'Laboratorio analítico' },
    { key: 'farmacia', label: 'Farmacia' },
    { key: 'clinicaPrivada', label: 'Clínica privada' },
    { key: 'clinicaVeterinaria', label: 'Clínica veterinaria' },
    { key: 'institucionEnsenanza', label: 'Institución de enseñanza superior' },
    { key: 'hospitalPublico', label: 'Hospital Público o Institución Oficial' },
    { key: 'investigacion', label: 'Investigación categoría I' },
    { key: 'otra', label: 'Otra, especifique' },
  ];

  const handleActivityChange = (key) => {
    setFormData({
      ...formData,
      actividades: {
        ...formData.actividades,
        [key]: !formData.actividades[key],
      },
    });
  };

  const handleCondicionChange = (value) => {
    setFormData({ ...formData, condicion: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que al menos una actividad esté seleccionada
    const { importadora, exportadora, fabricante, distribuidor, laboratorioAnalitico, farmacia, clinicaPrivada, clinicaVeterinaria, institucionEnsenanza, hospitalPublico, investigacion, otra } = formData.actividades;
    
    const algunaActividadSeleccionada = importadora || exportadora || fabricante || distribuidor || laboratorioAnalitico || farmacia || clinicaPrivada || clinicaVeterinaria || institucionEnsenanza || hospitalPublico || investigacion || (otra && otra.trim() !== '');
    
    if (!algunaActividadSeleccionada) {
      alert('Por favor, selecciona al menos una actividad');
      return;
    }
    
    console.log('Formulario enviado:', formData);
    
    // Verificar si se seleccionó Importadora, Exportadora o Fabricante
    const tieneActividadesEspeciales = importadora || exportadora || fabricante;
    
    if (tieneActividadesEspeciales) {
      // Navegar a pantalla 2 (Sustancias Controladas y Administrador)
      navigate('/solicitud-clase-b-2', { state: { formData, tieneActividadesEspeciales } });
    } else {
      // Ir directamente a pantalla 3 (sin documentos especiales)
      navigate('/solicitud-clase-b-3', { state: { formData, tieneActividadesEspeciales: false, vieneDeP2: false } });
    }
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
              onClick={() => navigate(-1)}
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
        {/* Formulario de Nueva Solicitud */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: Identificación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Identificación</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa / Razón Social
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección/Correo Postal (P.O.B)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000-000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ejemplo@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Actividades */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Actividades (es)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actividades.map(({ key, label }) =>
                key === 'otra' ? (
                  <div key={key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={formData.actividades[key] !== ''}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            actividades: {
                              ...formData.actividades,
                              [key]: ' ',
                            },
                          });
                        } else {
                          setFormData({
                            ...formData,
                            actividades: {
                              ...formData.actividades,
                              [key]: '',
                            },
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor={key} className="text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      {formData.actividades[key] !== '' && (
                        <input
                          type="text"
                          value={formData.actividades[key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              actividades: {
                                ...formData.actividades,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Especifique..."
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={formData.actividades[key]}
                      onChange={() => handleActivityChange(key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={key} className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* SECCIÓN 3: Condición de Solicitud */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Condición de Solicitud</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-a"
                  name="condicion"
                  value="a) Primera Solicitud"
                  checked={formData.condicion === "a) Primera Solicitud"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="condicion-a" className="text-sm font-medium text-gray-700">
                  a) Primera Solicitud
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-b"
                  name="condicion"
                  value="b) Renovación"
                  checked={formData.condicion === "b) Renovación"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="condicion-b" className="text-sm font-medium text-gray-700">
                  b) Renovación
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-c"
                  name="condicion"
                  value="c) Solicitud anterior negada"
                  checked={formData.condicion === "c) Solicitud anterior negada"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="condicion-c" className="text-sm font-medium text-gray-700">
                  c) Solicitud anterior negada
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-d"
                  name="condicion"
                  value="d) CIDC reprobado, suspendido"
                  checked={formData.condicion === "d) CIDC reprobado, suspendido"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="condicion-d" className="text-sm font-medium text-gray-700">
                  d) CIDC reprobado, suspendido
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-e"
                  name="condicion"
                  value="e) Otra, especifique"
                  checked={formData.condicion === "e) Otra, especifique"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="condicion-e" className="text-sm font-medium text-gray-700">
                    e) Otra, especifique:
                  </label>
                  {formData.condicion === "e) Otra, especifique" && (
                    <input
                      type="text"
                      className="w-40 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 mt-1"
                      placeholder=""
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Si su respuesta fue b o d, escriba el No. CIDC:
                </label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Si su respuesta fue c, d o e explique el motivo:
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  rows="3"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Regente Farmacéutico */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Regente Farmacéutico</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Regente
                </label>
                <input
                  type="text"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000-0000000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exequátur
                </label>
                <input
                  type="text"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: Pago */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Pago</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Cuenta de Ingresos Externos – DNCD (BanReservas)</span>
              </p>
              <p className="text-sm text-gray-600">
                No.: 100-01-240-012653-9
              </p>
              <p className="text-sm text-gray-600">
                Costo del Servicio: <span className="font-medium">RD$500.00</span>
              </p>
            </div>
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-center mb-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg w-full"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
