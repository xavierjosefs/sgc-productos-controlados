/**
 * Layout base para el panel de administrador
 * Topbar + Outlet para las vistas admin
 */
import { Outlet } from 'react-router-dom';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
