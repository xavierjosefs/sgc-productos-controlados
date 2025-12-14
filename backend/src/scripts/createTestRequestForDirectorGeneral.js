import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createTestRequest() {
  try {
    console.log('Creando solicitud de prueba para Director General...\n');

    // 1. Obtener el estado "aprobada_director_upc" (estado 7)
    const { data: estado } = await supabase
      .from('estados_solicitud')
      .select('id, nombre_mostrar')
      .eq('codigo_estado', 'aprobada_director_upc')
      .single();

    if (!estado) {
      console.error('❌ No se encontró el estado "aprobada_director_upc"');
      return;
    }

    console.log('✅ Estado encontrado:', estado.nombre_mostrar, '(ID:', estado.id, ')');

    // 2. Obtener un tipo de servicio (ejemplo: Licencia de Importación)
    const { data: tipoServicio } = await supabase
      .from('tipos_servicio')
      .select('id, nombre_servicio')
      .limit(1)
      .single();

    if (!tipoServicio) {
      console.error('❌ No se encontró ningún tipo de servicio');
      return;
    }

    console.log('✅ Tipo de servicio:', tipoServicio.nombre_servicio);

    // 3. Obtener un usuario cliente para asociar la solicitud
    const { data: cliente } = await supabase
      .from('users')
      .select('cedula, full_name')
      .eq('role_id', 1) // role_id 1 = cliente
      .limit(1)
      .single();

    if (!cliente) {
      console.error('❌ No se encontró ningún usuario cliente. Creando uno...');
      
      // Crear un usuario cliente de prueba
      const testCedula = '00100000001';
      const { data: newCliente } = await supabase
        .from('users')
        .insert({
          cedula: testCedula,
          email: 'cliente.prueba@test.com',
          full_name: 'Cliente de Prueba',
          password_hash: '$2b$10$dummy.hash.for.testing',
          role_id: 1,
          is_active: true
        })
        .select('cedula, full_name')
        .single();

      if (!newCliente) {
        console.error('❌ No se pudo crear usuario cliente de prueba');
        return;
      }
      
      console.log('✅ Cliente creado:', newCliente.full_name);
      cliente.cedula = newCliente.cedula;
      cliente.full_name = newCliente.full_name;
    } else {
      console.log('✅ Cliente encontrado:', cliente.full_name);
    }

    // 4. Crear la solicitud de prueba
    const formData = {
      nombreComercial: "Empresa de Prueba S.A.",
      nombreEncargado: cliente.full_name,
      telefonoEncargado: "809-555-1234",
      correoEncargado: "encargado@prueba.com",
      direccionAlmacen: "Av. Principal #123, Santo Domingo",
      descripcionProductos: "Productos controlados para pruebas del sistema"
    };

    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitudes')
      .insert({
        user_id: cliente.cedula,
        tipo_servicio_id: tipoServicio.id,
        estado_id: estado.id,
        tipo_solicitud: 'nueva',
        form_data: formData
      })
      .select()
      .single();

    if (solicitudError) {
      console.error('❌ Error al crear solicitud:', solicitudError);
      return;
    }

    console.log('\n✅ Solicitud creada exitosamente!');
    console.log('📋 ID de solicitud:', solicitud.id);
    console.log('👤 Cliente:', cliente.full_name);
    console.log('📝 Tipo de servicio:', tipoServicio.nombre_servicio);
    console.log('🟢 Estado:', estado.nombre_mostrar);
    console.log('\n🎉 Ahora puedes ver esta solicitud en el dashboard del Director General');
    console.log('🔗 http://localhost:5173/director-general');

  } catch (error) {
    console.error('\n❌ Error general:', error.message);
  }
}

createTestRequest();
