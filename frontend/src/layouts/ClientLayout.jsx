import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Layout principal del m├│dulo Cliente
 * Contiene: Sidebar + Topbar + ├ürea de contenido (Outlet)
 */
export default function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Navegaci├│n lateral */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar - Barra superior */}
        <Topbar />

        {/* ├ürea de contenido - Renderiza las p├íginas */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
