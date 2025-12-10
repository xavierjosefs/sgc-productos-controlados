import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createVentanillaUser() {
  try {
    console.log('Configurando usuario de ventanilla...');

    // 1. Crear usuario en Auth si no existe
    const email = 'fabianyoguen2@gmail.com';
    const password = '123456';
    const cedula = '00100000001';

    // Verificar si el usuario ya existe en Auth
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    let authUser = authUsers.users.find(u => u.email === email);

    if (!authUser) {
      // Crear usuario en Auth
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        console.error('Error al crear usuario en Auth:', authError);
        return;
      }

      authUser = data.user;
      console.log('✅ Usuario creado en Auth:', authUser.id);
    } else {
      console.log('✅ Usuario ya existe en Auth:', authUser.id);
    }

    // 2. Insertar o actualizar usuario en la tabla users
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (existingUser) {
      // Actualizar usuario existente
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          full_name: 'Fabian',
          email: email,
          role_id: 2, // 2 = ventanilla
          is_active: true
        })
        .eq('cedula', cedula)
        .select()
        .single();

      if (userError) {
        console.error('Error al actualizar usuario:', userError);
        return;
      }
      console.log('✅ Usuario actualizado:', userData);
    } else {
      // Crear nuevo usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          cedula: cedula,
          email: email,
          full_name: 'Fabian',
          role_id: 2, // 2 = ventanilla
          is_active: true,
          password_hash: '' // Se maneja con Auth
        })
        .select()
        .single();

      if (userError) {
        console.error('Error al crear usuario:', userError);
        return;
      }
      console.log('✅ Usuario creado:', userData);
    }
    console.log('\n📧 Email: fabianyoguen2@gmail.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Rol: ventanilla');
    console.log('\n✨ Usuario de ventanilla creado exitosamente');

  } catch (error) {
    console.error('Error general:', error);
  }
}

createVentanillaUser();
