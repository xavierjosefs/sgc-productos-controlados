import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function deleteSolicitudes() {
  try {
    console.log('Eliminando solicitudes de prueba (95, 96)...\n');

    // Eliminar solicitudes
    const { data, error } = await supabase
      .from('solicitudes')
      .delete()
      .in('id', [95, 96])
      .select();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Solicitudes eliminadas:');
    data?.forEach(s => {
      console.log(`  - Solicitud ${s.id}`);
    });

    console.log('\n🎉 Solicitudes de prueba eliminadas correctamente');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deleteSolicitudes();
