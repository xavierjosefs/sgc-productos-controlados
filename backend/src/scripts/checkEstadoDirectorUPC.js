import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkEstado() {
  try {
    console.log('Verificando estado 7 (Aprobada por Director UPC)...\n');

    // 1. Ver el estado con id = 7
    const { data: estado7 } = await supabase
      .from('estados_solicitud')
      .select('*')
      .eq('id', 7)
      .single();

    console.log('Estado ID 7:', estado7);

    // 2. Ver el estado con codigo_estado = 'aprobada_director_upc'
    const { data: estadoCodigo } = await supabase
      .from('estados_solicitud')
      .select('*')
      .eq('codigo_estado', 'aprobada_director_upc')
      .single();

    console.log('\nEstado con código "aprobada_director_upc":', estadoCodigo);

    // 3. Ver todas las solicitudes con estado_id = 7
    const { data: solicitudes } = await supabase
      .from('solicitudes')
      .select('id, estado_id')
      .eq('estado_id', 7);

    console.log('\nSolicitudes con estado_id = 7:', solicitudes?.length || 0);
    console.log(solicitudes);

    // 4. Ver el estado real de las solicitudes 95 y 96
    const { data: solicitudesPrueba } = await supabase
      .from('solicitudes')
      .select('id, estado_id, estados_solicitud(id, nombre_mostrar, codigo_estado)')
      .in('id', [95, 96]);

    console.log('\nSolicitudes de prueba (95, 96):');
    solicitudesPrueba?.forEach(s => {
      console.log(`  ID ${s.id}: estado_id=${s.estado_id}, estado=${s.estados_solicitud?.nombre_mostrar}, codigo=${s.estados_solicitud?.codigo_estado}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkEstado();
