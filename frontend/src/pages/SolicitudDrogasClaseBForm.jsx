import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import { useSolicitudClaseB } from '../contexts/SolicitudClaseBContext';
import useRequestsAPI from '../hooks/useRequestsAPI';

export default function SolicitudClaseB() {
  const navigate = useNavigate();
  const { updateFormData } = useSolicitudClaseB();
  const { createRequest } = useRequestsAPI();
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    nombreEmpresa: '',
    direccion: '',
    rnc: '',
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
    condicion: '',
    condicionOtra: '',
    noCIDC: '',
    motivo: '',
    nombreRegente: '',
    direccionRegente: '',
    cedulaRegente: '',
    exequaturRegente: '',
    telefonoRegente: '',
    otroLugarTrabajo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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
    setForm(prev => ({
      ...prev,
      actividades: {
        ...prev.actividades,
        [key]: !prev.actividades[key],
      },
    }));
  };

  const handleOtraActivityChange = (value) => {
    setForm(prev => ({
      ...prev,
      actividades: {
        ...prev.actividades,
        otra: value,
      },
    }));
  };

  const handleCondicionChange = (value) => {
    setForm(prev => ({ ...prev, condicion: value }));
  };

  // Validaciones
  const errors = (() => {
    const out = {};
    
    if (!form.nombreEmpresa?.trim()) out.nombreEmpresa = 'Este campo es obligatorio';
    if (!form.direccion?.trim()) out.direccion = 'Este campo es obligatorio';
    if (!form.rnc?.trim()) out.rnc = 'Este campo es obligatorio';
    if (!form.telefono?.trim()) out.telefono = 'Este campo es obligatorio';
    if (!form.correoElectronico?.trim()) out.correoElectronico = 'Este campo es obligatorio';
    
    if (form.correoElectronico && !/^\S+@\S+\.\S+$/.test(form.correoElectronico)) {
      out.correoElectronico = 'Email inválido';
    }
    
    const { importadora, exportadora, fabricante, distribuidor, laboratorioAnalitico, farmacia, 
            clinicaPrivada, clinicaVeterinaria, institucionEnsenanza, hospitalPublico, investigacion, otra } = form.actividades;
    
    const algunaActividadSeleccionada = importadora || exportadora || fabricante || distribuidor || 
                                        laboratorioAnalitico || farmacia || clinicaPrivada || 
                                        clinicaVeterinaria || institucionEnsenanza || hospitalPublico || 
                                        investigacion || (otra && otra.trim() !== '');
    
    if (!algunaActividadSeleccionada) out.actividades = 'Selecciona al menos una actividad';
    
    if (!form.condicion) out.condicion = 'Selecciona una condición';
    if (form.condicion === 'e) Otra, especifique' && !form.condicionOtra?.trim()) {
      out.condicionOtra = 'Especifique la condición';
    }
    
    if (form.condicion === 'b) Renovación' || form.condicion === 'd) CIDC reprobado, suspendido') {
      if (!form.noCIDC?.trim()) out.noCIDC = 'Ingrese el número CIDC';
    }
    
    if (form.condicion === 'c) Solicitud anterior negada' || 
        form.condicion === 'd) CIDC reprobado, suspendido' || 
        form.condicion === 'e) Otra, especifique') {
      if (!form.motivo?.trim()) out.motivo = 'Explique el motivo';
    }
    
    if (!form.nombreRegente?.trim()) out.nombreRegente = 'Este campo es obligatorio';
    if (!form.direccionRegente?.trim()) out.direccionRegente = 'Este campo es obligatorio';
    if (!form.cedulaRegente?.trim()) out.cedulaRegente = 'Este campo es obligatorio';
    if (!form.exequaturRegente?.trim()) out.exequaturRegente = 'Este campo es obligatorio';
    if (!form.telefonoRegente?.trim()) out.telefonoRegente = 'Este campo es obligatorio';
    
    if (form.cedulaRegente && !(/^\d{3}-\d{7}-\d{1}$/.test(form.cedulaRegente) || /^\d{11}$/.test(form.cedulaRegente))) {
      out.cedulaRegente = 'Formato de cédula inválido (ej: 000-0000000-0)';
    }
    
    return out;
  })();

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid || submitting) {
      if (!isValid) alert('Por favor, completa todos los campos requeridos correctamente');
      return;
    }
    
    // Guardar datos en el Context
    updateFormData(form);
    
    // Verificar si se seleccionó Importadora, Exportadora o Fabricante
    const { importadora, exportadora, fabricante } = form.actividades;
    const tieneActividadesEspeciales = importadora || exportadora || fabricante;
    
    if (tieneActividadesEspeciales) {
      // Si tiene actividades especiales, ir al paso 2 (aún no crear solicitud)
      navigate('/solicitud-drogas-clase-b/paso-2');
    } else {
      // Si NO tiene actividades especiales, crear la solicitud ahora
      setSubmitting(true);
      try {
        const resp = await createRequest({
          nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados',
          formulario: form
        });
        
        const newRequest = resp.request || resp;
        const requestId = newRequest.id || newRequest.request?.id;

        if (!requestId) {
          throw new Error('No se pudo crear la solicitud');
        }

        navigate('/solicitud-drogas-clase-b/documentos', { 
          state: { requestId, fromForm: true } 
        });
      } catch (error) {
        console.error('Error al crear solicitud:', error);
        alert(error?.message || 'Error al guardar la solicitud. Por favor intenta de nuevo.');
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-[#4A8BDF] mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">Solicitud de Certificado de Inscripción de Drogas Controladas Clase B</h1>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Identificación Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Identificación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Nombre de la Empresa / Razón Social *</label>
                <input
                  name="nombreEmpresa"
                  placeholder=""
                  value={form.nombreEmpresa}
                  onChange={handleChange}
                  className={`${errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.nombreEmpresa}
                />
                {errors.nombreEmpresa && <p className="text-xs text-red-500 mt-2">{errors.nombreEmpresa}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Dirección/Correo Postal (P.O.B) *</label>
                <input
                  name="direccion"
                  placeholder=""
                  value={form.direccion}
                  onChange={handleChange}
                  className={`${errors.direccion ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.direccion}
                />
                {errors.direccion && <p className="text-xs text-red-500 mt-2">{errors.direccion}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">RNC *</label>
                <input
                  name="rnc"
                  placeholder="000000000"
                  value={form.rnc}
                  onChange={handleChange}
                  className={`${errors.rnc ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.rnc}
                />
                {errors.rnc && <p className="text-xs text-red-500 mt-2">{errors.rnc}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Teléfono *</label>
                <input
                  name="telefono"
                  placeholder="000-000-0000"
                  value={form.telefono}
                  onChange={handleChange}
                  className={`${errors.telefono ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.telefono}
                />
                {errors.telefono && <p className="text-xs text-red-500 mt-2">{errors.telefono}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Correo Electrónico *</label>
                <input
                  name="correoElectronico"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={form.correoElectronico}
                  onChange={handleChange}
                  className={`${errors.correoElectronico ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.correoElectronico}
                />
                {errors.correoElectronico && <p className="text-xs text-red-500 mt-2">{errors.correoElectronico}</p>}
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Actividades */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Actividades *</h2>
            {errors.actividades && <p className="text-xs text-red-500 mb-3">{errors.actividades}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actividades.map(({ key, label }) =>
                key === 'otra' ? (
                  <div key={key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={form.actividades[key] !== ''}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleOtraActivityChange(' ');
                        } else {
                          handleOtraActivityChange('');
                        }
                      }}
                      className="mt-1 w-4 h-4 text-[#4A8BDF] rounded focus:ring-[#4A8BDF]"
                    />
                    <div className="flex-1">
                      <label htmlFor={key} className="text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      {form.actividades[key] !== '' && (
                        <input
                          type="text"
                          value={form.actividades[key]}
                          onChange={(e) => handleOtraActivityChange(e.target.value)}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
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
                      checked={form.actividades[key]}
                      onChange={() => handleActivityChange(key)}
                      className="w-4 h-4 text-[#4A8BDF] rounded focus:ring-[#4A8BDF]"
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
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Condición de Solicitud *</h2>
            {errors.condicion && <p className="text-xs text-red-500 mb-3">{errors.condicion}</p>}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="condicion-a"
                  name="condicion"
                  value="a) Primera Solicitud"
                  checked={form.condicion === "a) Primera Solicitud"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
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
                  checked={form.condicion === "b) Renovación"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
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
                  checked={form.condicion === "c) Solicitud anterior negada"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
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
                  checked={form.condicion === "d) CIDC reprobado, suspendido"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
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
                  checked={form.condicion === "e) Otra, especifique"}
                  onChange={(e) => handleCondicionChange(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
                />
                <div className="flex-1">
                  <label htmlFor="condicion-e" className="text-sm font-medium text-gray-700">
                    e) Otra, especifique:
                  </label>
                  {form.condicion === "e) Otra, especifique" && (
                    <>
                      <input
                        type="text"
                        name="condicionOtra"
                        value={form.condicionOtra}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] mt-1"
                        placeholder="Especifique la condición"
                      />
                      {errors.condicionOtra && <p className="text-xs text-red-500 mt-1">{errors.condicionOtra}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3 pt-4">
              {(form.condicion === "b) Renovación" || form.condicion === "d) CIDC reprobado, suspendido") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escriba el No. CIDC: *
                  </label>
                  <input
                    type="text"
                    name="noCIDC"
                    value={form.noCIDC}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                    placeholder="Número CIDC"
                  />
                  {errors.noCIDC && <p className="text-xs text-red-500 mt-1">{errors.noCIDC}</p>}
                </div>
              )}
              {(form.condicion === "c) Solicitud anterior negada" || 
                form.condicion === "d) CIDC reprobado, suspendido" ||
                form.condicion === "e) Otra, especifique") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explique el motivo: *
                  </label>
                  <textarea
                    name="motivo"
                    value={form.motivo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                    rows="3"
                    placeholder="Motivo de la solicitud"
                  />
                  {errors.motivo && <p className="text-xs text-red-500 mt-1">{errors.motivo}</p>}
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 4: Regente Farmacéutico */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Regente Farmacéutico *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Nombre del Regente *</label>
                <input
                  name="nombreRegente"
                  placeholder=""
                  value={form.nombreRegente}
                  onChange={handleChange}
                  className={`${errors.nombreRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.nombreRegente}
                />
                {errors.nombreRegente && <p className="text-xs text-red-500 mt-2">{errors.nombreRegente}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Dirección *</label>
                <input
                  name="direccionRegente"
                  placeholder=""
                  value={form.direccionRegente}
                  onChange={handleChange}
                  className={`${errors.direccionRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.direccionRegente}
                />
                {errors.direccionRegente && <p className="text-xs text-red-500 mt-2">{errors.direccionRegente}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Cédula de Identidad y Electoral *</label>
                <input
                  name="cedulaRegente"
                  placeholder="000-0000000-0"
                  value={form.cedulaRegente}
                  onChange={handleChange}
                  className={`${errors.cedulaRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.cedulaRegente}
                />
                {errors.cedulaRegente && <p className="text-xs text-red-500 mt-2">{errors.cedulaRegente}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Exequátur *</label>
                <input
                  name="exequaturRegente"
                  placeholder=""
                  value={form.exequaturRegente}
                  onChange={handleChange}
                  className={`${errors.exequaturRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  aria-invalid={!!errors.exequaturRegente}
                />
                {errors.exequaturRegente && <p className="text-xs text-red-500 mt-1">{errors.exequaturRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s) *
                </label>
                <input
                  type="text"
                  name="telefonoRegente"
                  value={form.telefonoRegente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  placeholder=""
                  required
                />
                {errors.telefonoRegente && <p className="text-xs text-red-500 mt-1">{errors.telefonoRegente}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Otro Lugar de Trabajo</label>
                <input
                  name="otroLugarTrabajo"
                  placeholder=""
                  value={form.otroLugarTrabajo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: Pago */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Pago</h2>
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
