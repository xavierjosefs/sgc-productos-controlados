import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function resetPassword() {
  try {
    const email = 'fabianyoguen2@gmail.com';
    const newPassword = '123456';

    console.log('Reseteando contraseña para:', email);

    // Obtener el usuario
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error('Usuario no encontrado');
      return;
    }

    // Actualizar contraseña
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error('Error al actualizar contraseña:', error);
      return;
    }

    console.log('✅ Contraseña actualizada exitosamente');
    console.log('📧 Email:', email);
    console.log('🔑 Nueva contraseña:', newPassword);

  } catch (error) {
    console.error('Error:', error);
  }
}

resetPassword();
