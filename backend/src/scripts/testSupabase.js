import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('=== Test Supabase Connection ===');
console.log('URL:', supabaseUrl);
console.log('Key starts with:', supabaseKey?.substring(0, 20) + '...');
console.log('Key length:', supabaseKey?.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n--- Listando buckets ---');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error al listar buckets:', bucketsError);
      return;
    }
    
    console.log('Buckets disponibles:', buckets.map(b => b.name));
    
    const documentosBucket = buckets.find(b => b.name === 'documentos');
    
    if (!documentosBucket) {
      console.log('\n❌ El bucket "documentos" NO EXISTE');
      console.log('Necesitas crearlo en: https://supabase.com/dashboard/project/izrfbbdxpmnpwnlxyczb/storage/buckets');
    } else {
      console.log('\n✅ El bucket "documentos" existe');
      console.log('Bucket info:', documentosBucket);
      
      // Intentar subir un archivo de prueba
      console.log('\n--- Probando subir archivo ---');
      const testContent = new Uint8Array([1, 2, 3, 4, 5]);
      const testPath = `test/test-${Date.now()}.txt`;
      
      const { data, error } = await supabase.storage
        .from('documentos')
        .upload(testPath, testContent, {
          contentType: 'text/plain',
          upsert: true
        });
      
      if (error) {
        console.error('❌ Error al subir archivo de prueba:', error);
      } else {
        console.log('✅ Archivo de prueba subido exitosamente:', data);
        
        // Limpiar archivo de prueba
        await supabase.storage.from('documentos').remove([testPath]);
        console.log('✅ Archivo de prueba eliminado');
      }
    }
  } catch (error) {
    console.error('Error en test:', error);
  }
}

testConnection();
