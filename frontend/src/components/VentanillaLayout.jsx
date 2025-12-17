import { Outlet } from 'react-router-dom';
import VentanillaTopbar from './VentanillaTopbar';

export default function VentanillaLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <VentanillaTopbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
