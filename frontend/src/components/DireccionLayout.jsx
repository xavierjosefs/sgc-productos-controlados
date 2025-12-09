import { Outlet } from 'react-router-dom';
import ClientTopbar from './ClientTopbar';

/**
 * Layout component for Dirección role
 * Provides consistent layout with topbar and nested route outlet
 */
export default function DireccionLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
