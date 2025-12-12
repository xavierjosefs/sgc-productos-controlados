import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifyEstados() {
  try {
    console.log('Verificando estados del flujo...\n');

    // Ver todos los estados
    const { data: estados } = await supabase
      .from('estados_solicitud')
      .select('*')
      .order('id');

    console.log('=== TODOS LOS ESTADOS ===');
    estados?.forEach(e => {
      console.log(`ID ${e.id}: ${e.nombre_mostrar} (código: ${e.codigo_estado})`);
    });

    console.log('\n=== ESTADOS RELEVANTES PARA EL FLUJO ===');
    
    // Estado 6 - Director Técnico aprueba
    const { data: estado6 } = await supabase
      .from('estados_solicitud')
      .select('*')
      .eq('id', 6)
      .single();
    console.log('Estado 6:', estado6);

    // Estado 7 - Dirección debe ver
    const { data: estado7 } = await supabase
      .from('estados_solicitud')
      .select('*')
      .eq('id', 7)
      .single();
    console.log('Estado 7:', estado7);

    // Estado 15 - aprobada_director_upc
    const { data: estado15 } = await supabase
      .from('estados_solicitud')
      .select('*')
      .eq('id', 15)
      .single();
    console.log('Estado 15:', estado15);

    console.log('\n=== RECOMENDACIÓN ===');
    console.log('Cuando Director Técnico APRUEBA → debe poner estado_id = 7');
    console.log('Dirección debe BUSCAR solicitudes con estado_id = 7');

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyEstados();
