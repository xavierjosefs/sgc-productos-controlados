import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import { useSolicitudClaseA } from '../contexts/SolicitudClaseAContext';

const SolicitudDrogasClaseAForm = () => {
  const navigate = useNavigate();
  const { updateFormData } = useSolicitudClaseA();
  const [form, setForm] = useState({});

  // usar el estado `form` para evitar warning de linter mientras se integra la lógica de envío
  useEffect(() => {
    // noop: mantenemos la dependencia para que el linter considere `form` en uso
  }, [form]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    // Guardar datos del formulario en context antes de navegar
    updateFormData(form);
    navigate('/solicitud-drogas-clase-a/documentos');
  };

  const errors = (() => {
    const out = {};
    const required = [
      'nombre','direccion','cedula','exequatur','colegiatura','celular','telefonos','email','lugarTrabajo','direccionTrabajo',
    ];
    for (const key of required) {
      if (!form[key] || String(form[key]).trim() === '') out[key] = 'Este campo es obligatorio';
    }

    // profesión
    if (!form.profesion) out.profesion = 'Selecciona una profesión';
    if (form.profesion === 'Otra' && (!form.profesionOtra || String(form.profesionOtra).trim() === '')) out.profesionOtra = 'Especifique la profesión';

    // categorías
    if (!form.categoriaII && !form.categoriaIII && !form.categoriaIV) out.categorias = 'Seleccione al menos una categoría';

    // condición
    if (!form.condicion) out.condicion = 'Selecciona la condición de la solicitud';
    if (form.condicion === 'Otra' && (!form.condicionOtra || String(form.condicionOtra).trim() === '')) out.condicionOtra = 'Especifique la condición';

    if (form.condicion === 'Renovación' || form.condicion === 'CIDC revocada, suspendida') {
      if (!form.noCIDC || String(form.noCIDC).trim() === '') out.noCIDC = 'Ingrese el número CIDC';
    }

    if (['Solicitud anterior negada','CIDC revocada, suspendida','Otra'].includes(form.condicion)) {
      if (!form.motivo || String(form.motivo).trim() === '') out.motivo = 'Explique el motivo';
    }

    // formatos
    if (form.email && !/^\S+@\S+\.\S+$/.test(String(form.email))) out.email = 'Email inválido';
    if (form.celular && !/^[0-9\-\s+]{7,15}$/.test(String(form.celular))) out.celular = 'Teléfono inválido';
    if (form.cedula && !( /^\d{3}-\d{7}-\d{1}$/.test(String(form.cedula)) || /^\d{11}$/.test(String(form.cedula)) )) out.cedula = 'Formato de cédula inválido (ej: 000-0000000-0)';

    return out;
  })();

  const isValid = Object.keys(errors).length === 0;

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
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">Solicitud de Certificado de Inscripción de Drogas Controladas Clase A</h1>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Identificación Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Identificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Nombre Completo del Profesional</label>
                  <input name="nombre" placeholder="" onChange={handleChange} className={`${errors.nombre ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`} aria-invalid={!!errors.nombre} />
                  {errors.nombre && <p className="text-xs text-red-500 mt-2">{errors.nombre}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Dirección/Correo Postal (P.O.B)</label>
                  <textarea name="direccion" placeholder="" onChange={handleChange} rows={3} className={`${errors.direccion ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`} aria-invalid={!!errors.direccion}></textarea>
                  {errors.direccion && <p className="text-xs text-red-500 mt-2">{errors.direccion}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Cédula de Identidad y Electoral</label>
                  <input name="cedula" placeholder="000-0000000-0" onChange={handleChange} className={`${errors.cedula ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400`} aria-invalid={!!errors.cedula} />
                  {errors.cedula && <p className="text-xs text-red-500 mt-2">{errors.cedula}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Exequátur</label>
                  <input name="exequatur" placeholder="" onChange={handleChange} className={`${errors.exequatur ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.exequatur} />
                  {errors.exequatur && <p className="text-xs text-red-500 mt-2">{errors.exequatur}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">No. Colegiatura</label>
                  <input name="colegiatura" placeholder="" onChange={handleChange} className={`${errors.colegiatura ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.colegiatura} />
                  {errors.colegiatura && <p className="text-xs text-red-500 mt-2">{errors.colegiatura}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Celular</label>
                  <input name="celular" placeholder="000-000-0000" onChange={handleChange} className={`${errors.celular ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.celular} />
                  {errors.celular && <p className="text-xs text-red-500 mt-2">{errors.celular}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Teléfono(s)</label>
                  <input name="telefonos" placeholder="" onChange={handleChange} className={`${errors.telefonos ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.telefonos} />
                  {errors.telefonos && <p className="text-xs text-red-500 mt-2">{errors.telefonos}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Correo Electrónico</label>
                  <input name="email" type="email" placeholder="ejemplo@gmail.com" onChange={handleChange} className={`${errors.email ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg placeholder-gray-400`} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Lugar de Trabajo</label>
                  <input name="lugarTrabajo" placeholder="" onChange={handleChange} className={`${errors.lugarTrabajo ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.lugarTrabajo} />
                  {errors.lugarTrabajo && <p className="text-xs text-red-500 mt-2">{errors.lugarTrabajo}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Dirección del Lugar de Trabajo</label>
                  <input name="direccionTrabajo" placeholder="" onChange={handleChange} className={`${errors.direccionTrabajo ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.direccionTrabajo} />
                  {errors.direccionTrabajo && <p className="text-xs text-red-500 mt-2">{errors.direccionTrabajo}</p>}
                </div>
              </div>
            </div>

          {/* Profesión Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Profesión</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4">
                <input type="radio" name="profesion" value="Medicina" onChange={handleChange} className="w-5 h-5 text-[#2B6CB0]" />
                <span className="text-gray-700">Medicina</span>
              </label>
              <label className="flex items-center gap-4">
                <input type="radio" name="profesion" value="Medicina Veterinaria" onChange={handleChange} className="w-5 h-5 text-[#2B6CB0]" />
                <span className="text-gray-700">Medicina Veterinaria</span>
              </label>
              <label className="flex items-center gap-4">
                <input type="radio" name="profesion" value="Odontología" onChange={handleChange} className="w-5 h-5 text-[#2B6CB0]" />
                <span className="text-gray-700">Odontología</span>
              </label>

              <div className="flex items-center gap-4">
                <input type="radio" name="profesion" value="Otra" onChange={handleChange} className="w-5 h-5 text-[#2B6CB0]" />
                <span className="text-gray-700">Otra, especifique:</span>
                <input name="profesionOtra" placeholder="" onChange={handleChange} className={`${errors.profesionOtra ? 'border-red-500' : 'border-gray-300'} flex-1 px-4 py-3 border rounded-lg`} aria-invalid={!!errors.profesionOtra} />
              </div>
              {errors.profesion && <p className="text-xs text-red-500">{errors.profesion}</p>}
              {errors.profesionOtra && <p className="text-xs text-red-500">{errors.profesionOtra}</p>}

              <div>
                <div className="text-sm text-gray-700 mb-3">Categorías de Drogas Controladas que tendrá derecho a prescribir o administrar:</div>
                <div className="flex gap-10 items-center">
                  <label className="flex items-center gap-3"><input type="checkbox" name="categoriaII" onChange={handleChange} className="w-6 h-6 rounded-md border-gray-300" /> <span className="text-gray-700">II</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" name="categoriaIII" onChange={handleChange} className="w-6 h-6 rounded-md border-gray-300" /> <span className="text-gray-700">III</span></label>
                  <label className="flex items-center gap-3"><input type="checkbox" name="categoriaIV" onChange={handleChange} className="w-6 h-6 rounded-md border-gray-300" /> <span className="text-gray-700">IV</span></label>
                </div>
                {errors.categorias && <p className="text-xs text-red-500">{errors.categorias}</p>}
              </div>
            </div>
          </div>

          {/* Condición Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Condición de Solicitud</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4"><input type="radio" name="condicion" value="Primera Solicitud" onChange={handleChange} className="w-5 h-5" /> <span className="text-gray-700">a) Primera Solicitud</span></label>
              <label className="flex items-center gap-4"><input type="radio" name="condicion" value="Renovación" onChange={handleChange} className="w-5 h-5" /> <span className="text-gray-700">b) Renovación</span></label>
              <label className="flex items-center gap-4"><input type="radio" name="condicion" value="Solicitud anterior negada" onChange={handleChange} className="w-5 h-5" /> <span className="text-gray-700">c) Solicitud anterior negada</span></label>
              <label className="flex items-center gap-4"><input type="radio" name="condicion" value="CIDC revocada, suspendida" onChange={handleChange} className="w-5 h-5" /> <span className="text-gray-700">d) CIDC reprobado, suspendido</span></label>
              <div className="flex items-center gap-4">
                <input type="radio" name="condicion" value="Otra" onChange={handleChange} className="w-5 h-5" />
                <span className="text-gray-700">e) Otra, especifique:</span>
                <input name="condicionOtra" placeholder="" onChange={handleChange} className={`${errors.condicionOtra ? 'border-red-500' : 'border-gray-300'} flex-1 px-4 py-3 border rounded-lg`} aria-invalid={!!errors.condicionOtra} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Si su respuesta fue b o d, escriba el <strong>No. CIDC:</strong></label>
                  <input name="noCIDC" placeholder="" onChange={handleChange} className={`${errors.noCIDC ? 'border-red-500' : 'border-gray-300'} mt-2 w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.noCIDC} />
                  {errors.noCIDC && <p className="text-xs text-red-500 mt-2">{errors.noCIDC}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Si su respuesta fue c, d o e explique el motivo:</label>
                  <textarea name="motivo" rows={4} placeholder="" onChange={handleChange} className={`${errors.motivo ? 'border-red-500' : 'border-gray-300'} mt-2 w-full px-4 py-3 border rounded-lg`} aria-invalid={!!errors.motivo}></textarea>
                  {errors.motivo && <p className="text-xs text-red-500 mt-2">{errors.motivo}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Pago Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-4">Pago</h2>
            <div className="text-gray-700 text-base leading-relaxed">
              <div>Cuenta de ingresos Externos – DNCD (Tesorería):</div>
              <div>No.: 100-01-201-032353-9</div>
              <div className="font-semibold mt-2">Costo del Servicio: RD$1500.00</div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid}
              className={`${isValid ? 'bg-[#0B57A6] hover:bg-[#084c8a] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} w-full font-semibold py-3 rounded-md`}
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudDrogasClaseAForm;
