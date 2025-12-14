import { Outlet } from 'react-router-dom';

/**
 * Layout component for Direccion role
 * Provides consistent layout with topbar and nested route outlet
 */
export default function DireccionLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <Outlet />
            </main>
        </div>
    );
}
