import { Outlet } from 'react-router-dom';
import DirectorTecnicoTopbar from './DirectorTecnicoTopbar';

function DirectorTecnicoLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <DirectorTecnicoTopbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default DirectorTecnicoLayout;
