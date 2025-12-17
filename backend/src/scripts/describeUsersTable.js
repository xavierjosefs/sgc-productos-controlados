import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Las variables SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function describeUsersTable() {
  try {
    console.log('Consultando estructura de la tabla users...\n');

    // Intentar obtener un registro para ver la estructura
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error al consultar tabla:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columnas encontradas:');
      Object.keys(data[0]).forEach(col => {
        console.log(`  - ${col}: ${typeof data[0][col]}`);
      });
      console.log('\nEjemplo de registro:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('La tabla está vacía. Verificando si existe...');
      
      // Intentar insertar y ver el error
      const { error: insertError } = await supabase
        .from('users')
        .insert({ test: 'test' });
      
      if (insertError) {
        console.log('Error al insertar (esto nos ayuda a ver la estructura):', insertError);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

describeUsersTable();
