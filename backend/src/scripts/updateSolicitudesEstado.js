import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function updateSolicitudes() {
  try {
    console.log('Actualizando solicitudes 95 y 96 al estado correcto...\n');

    // Actualizar solicitudes al estado 15 (aprobada_director_upc)
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado_id: 15 })
      .in('id', [95, 96])
      .select();

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('✅ Solicitudes actualizadas:');
    data?.forEach(s => {
      console.log(`  - Solicitud ${s.id}: estado_id = ${s.estado_id}`);
    });

    console.log('\n🎉 Ahora las solicitudes deberían aparecer en el dashboard de Dirección');

  } catch (error) {
    console.error('Error:', error);
  }
}

updateSolicitudes();
