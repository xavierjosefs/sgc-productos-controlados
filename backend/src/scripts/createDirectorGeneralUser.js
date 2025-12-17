import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createDirectorGeneralUser() {
  try {
    console.log('Configurando usuario de Director General...');

    // Datos del usuario
    const email = 'director.general@dncd.gob.do';
    const password = '123456';
    const cedula = '00199999999';

    // 1. Crear usuario en Auth si no existe
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    let authUser = authUsers.users.find(u => u.email === email);

    if (!authUser) {
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

    // 2. Obtener el role_id para 'direccion'
    const { data: roles } = await supabase
      .from('roles')
      .select('id, name')
      .eq('name', 'direccion')
      .single();

    if (!roles) {
      console.error('❌ No se encontró el rol "direccion"');
      return;
    }

    console.log('✅ Rol encontrado:', roles.name, '(ID:', roles.id, ')');

    // 3. Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Insertar o actualizar usuario en la tabla users
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
          email: email,
          role_id: roles.id,
          full_name: 'Fabian Alcantara',
          password_hash: passwordHash,
          is_active: true
        })
        .eq('cedula', cedula)
        .select()
        .single();

      if (userError) {
        console.error('Error al actualizar usuario:', userError);
        return;
      }

      console.log('✅ Usuario actualizado en tabla users:', userData);
    } else {
      // Insertar nuevo usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          cedula: cedula,
          email: email,
          role_id: roles.id,
          full_name: 'Fabian Alcantara',
          password_hash: passwordHash,
          is_active: true
        })
        .select()
        .single();

      if (userError) {
        console.error('Error al insertar usuario:', userError);
        return;
      }

      console.log('✅ Usuario insertado en tabla users:', userData);
    }

    console.log('\n🎉 ¡Usuario de Director General creado exitosamente!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 Cédula:', cedula);
    console.log('👤 Rol: Director General (direccion)');
    console.log('\n✅ Ya puedes iniciar sesión en: http://localhost:5173');

  } catch (error) {
    console.error('Error general:', error);
  } finally {
    process.exit(0);
  }
}

createDirectorGeneralUser();
