import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import { useToast } from '../../hooks/useToast';
import { serviceSchema, validateWithSchema } from '../../utils/validation';
import { SkeletonForm } from '../../components/SkeletonLoaders';

export default function AdminServicioCrear() {
  const navigate = useNavigate();
  const toast = useToast();
  const api = useAdminAPI();
  
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoFormulario, setTipoFormulario] = useState('');
  const [precioTipo, setPrecioTipo] = useState('conPrecio');
  const [precio, setPrecio] = useState('');
  
  const [docsNuevaSolicitud, setDocsNuevaSolicitud] = useState([
    { nombre: '', obligatorio: true }
  ]);
  const [docsRenovacion, setDocsRenovacion] = useState([]);
  const [docsRoboPerdida, setDocsRoboPerdida] = useState([]);

  const [errors, setErrors] = useState({});

  // Fetch form types
  const { data: formsData, loading } = useAdminData(api.getForms);
  const tiposFormulario = formsData?.forms || [];

  const agregarDocumento = (tipo) => {
    const nuevoDoc = { nombre: '', obligatorio: true };
    if (tipo === 'nueva') {
      setDocsNuevaSolicitud([...docsNuevaSolicitud, nuevoDoc]);
    } else if (tipo === 'renovacion') {
      setDocsRenovacion([...docsRenovacion, nuevoDoc]);
    } else if (tipo === 'robo') {
      setDocsRoboPerdida([...docsRoboPerdida, nuevoDoc]);
    }
  };

  const actualizarDocumento = (tipo, index, campo, valor) => {
    if (tipo === 'nueva') {
      const nuevos = [...docsNuevaSolicitud];
      nuevos[index][campo] = valor;
      setDocsNuevaSolicitud(nuevos);
    } else if (tipo === 'renovacion') {
      const nuevos = [...docsRenovacion];
      nuevos[index][campo] = valor;
      setDocsRenovacion(nuevos);
    } else if (tipo === 'robo') {
      const nuevos = [...docsRoboPerdida];
      nuevos[index][campo] = valor;
      setDocsRoboPerdida(nuevos);
    }
  };

  const eliminarDocumento = (tipo, index) => {
    if (tipo === 'nueva') {
      setDocsNuevaSolicitud(docsNuevaSolicitud.filter((_, i) => i !== index));
    } else if (tipo === 'renovacion') {
      setDocsRenovacion(docsRenovacion.filter((_, i) => i !== index));
    } else if (tipo === 'robo') {
      setDocsRoboPerdida(docsRoboPerdida.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!codigo.trim()) {
        newErrors.codigo = 'El código del servicio es requerido';
    }
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre del servicio es requerido';
    }
    if (!tipoFormulario) {
      newErrors.tipoFormulario = 'Debe seleccionar un tipo de formulario';
    }
    if (precioTipo === 'conPrecio' && (!precio || parseFloat(precio) <= 0)) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
        const documentosRequeridos = {
            nueva: docsNuevaSolicitud.filter(d => d.nombre.trim()),
            renovacion: docsRenovacion.filter(d => d.nombre.trim()),
            robo: docsRoboPerdida.filter(d => d.nombre.trim())
        };

        await api.createService({
            codigo_servicio: codigo,
            nombre_servicio: nombre,
            precio: precioTipo === 'conPrecio' ? parseFloat(precio) : 0,
            documentos_requeridos: documentosRequeridos,
            formulario: tipoFormulario
        });
        
        toast.success('Servicio creado exitosamente');
        navigate('/admin/servicios');

    } catch (error) {
        console.error("Error creating service:", error);
        if (error.response && error.response.data && error.response.data.error) {
             toast.error(`Error: ${error.response.data.error}`);
        } else {
             toast.error("Error creando el servicio");
        }
    }
  };

  const renderDocumentos = (tipo, documentos, titulo) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">{titulo}</h3>
      {documentos.length === 0 ? (
        <p className="text-gray-500 text-sm mb-2">No hay documentos agregados</p>
      ) : (
        documentos.map((doc, index) => (
          <div key={index} className="flex gap-3 items-center mb-3">
            <input
              type="text"
              placeholder="Nombre del Documento"
              value={doc.nombre}
              onChange={(e) => actualizarDocumento(tipo, index, 'nombre', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={doc.obligatorio === true}
                  onChange={() => actualizarDocumento(tipo, index, 'obligatorio', true)}
                  className="w-4 h-4 text-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Obligatorio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={doc.obligatorio === false}
                  onChange={() => actualizarDocumento(tipo, index, 'obligatorio', false)}
                  className="w-4 h-4 text-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Opcional</span>
              </label>
            </div>
            {documentos.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarDocumento(tipo, index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))
      )}
      <button
        type="button"
        onClick={() => agregarDocumento(tipo)}
        className="text-[#4A8BDF] text-sm font-medium hover:underline"
      >
        Agregar Documento
      </button>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando formulario...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin/servicios')}
        className="flex items-center text-[#4A8BDF] mb-6 hover:text-[#3875C8] transition-colors"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Crear un Servicio</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Card Información */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 max-w-[620px] mx-auto">
          <h2 className="text-lg font-bold text-[#085297] mb-6">Información</h2>
          
          <div className="space-y-4">
             {/* Codigo del Servicio */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Servicio
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: SERV-001"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                  errors.codigo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.codigo && (
                <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>
              )}
            </div>

            {/* Nombre del Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Tipo de Formulario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Formulario
              </label>
              <select
                value={tipoFormulario}
                onChange={(e) => setTipoFormulario(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                  errors.tipoFormulario ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un tipo</option>
                {tiposFormulario.map((tipo) => (
                  <option key={tipo.id} value={tipo.nombre}>{tipo.nombre} ({tipo.codigo})</option>
                ))}
              </select>
              {errors.tipoFormulario && (
                <p className="text-red-500 text-sm mt-1">{errors.tipoFormulario}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={precioTipo === 'conPrecio'}
                    onChange={() => setPrecioTipo('conPrecio')}
                    className="w-4 h-4 text-[#4A8BDF]"
                  />
                  <span className="text-gray-700">RD$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    disabled={precioTipo !== 'conPrecio'}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                      precioTipo !== 'conPrecio' ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    } ${errors.precio ? 'border-red-500' : ''}`}
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={precioTipo === 'sinCosto'}
                    onChange={() => setPrecioTipo('sinCosto')}
                    className="w-4 h-4 text-[#4A8BDF]"
                  />
                  <span className="text-gray-700">Sin Costo</span>
                </label>
              </div>
              {errors.precio && (
                <p className="text-red-500 text-sm mt-1">{errors.precio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Documentos Requeridos */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 max-w-[620px] mx-auto">
          <h2 className="text-lg font-bold text-[#085297] mb-6">Documentos Requeridos</h2>
          
          {renderDocumentos('nueva', docsNuevaSolicitud, 'Nueva Solicitud')}
          {renderDocumentos('renovacion', docsRenovacion, 'Renovación')}
          {renderDocumentos('robo', docsRoboPerdida, 'Robo o Pérdida')}
        </div>

        {/* Botones */}
        <div className="flex gap-4 max-w-[620px] mx-auto">
          <button
            type="button"
            onClick={() => navigate('/admin/servicios')}
            className="flex-1 bg-[#A8C5E8] text-gray-700 rounded-lg px-8 py-3 hover:bg-[#97b4d7] transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#085297] text-white rounded-lg px-8 py-3 hover:bg-[#064175] transition-colors font-medium"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
