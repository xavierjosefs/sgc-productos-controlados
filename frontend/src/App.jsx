import RequestDetail from './pages/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Support from './pages/Support';
import Requests from './pages/Requests';
import RequestsFiltered from './pages/RequestsFiltered';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

import { AuthProvider } from './context/AuthContext';

// Role-specific dashboards
import ClienteDashboard from './pages/cliente/Dashboard';
import VentanillaDashboard from './pages/ventanilla/Dashboard';
import TecnicoControladosDashboard from './pages/tecnico-controlados/Dashboard';
import DirectorControladosDashboard from './pages/director-controlados/Dashboard';
import DireccionDashboard from './pages/direccion/Dashboard';
import DncdDashboard from './pages/dncd/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Clase A
import SolicitudDrogasClaseAForm from './pages/SolicitudDrogasClaseAForm';
import DocumentosSolicitudDrogasClaseA from './pages/DocumentosSolicitudDrogasClaseA';
import DocumentosSolicitudDrogasClaseARenovacion from './pages/DocumentosSolicitudDrogasClaseARenovacion';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';
import { SolicitudClaseAProvider } from './contexts/SolicitudClaseAContext';

// Clase B
import SolicitudDrogasClaseBForm from './pages/SolicitudDrogasClaseBForm';
import SolicitudDrogasClaseBForm2 from './pages/SolicitudDrogasClaseBForm2';
import DocumentosSolicitudDrogasClaseB from './pages/DocumentosSolicitudDrogasClaseB';
import SolicitudDrogasClaseBExito from './pages/SolicitudDrogasClaseBExito';
import { SolicitudClaseBProvider } from './contexts/SolicitudClaseBContext';

// Clase B Capa C
import SolicitudClaseBCapaCForm from './pages/SolicitudClaseBCapaCForm';
import SolicitudClaseBCapaCActividadesForm from './pages/SolicitudClaseBCapaCActividadesForm';
import DocumentosSolicitudClaseBCapaC from './pages/DocumentosSolicitudClaseBCapaC';
import SolicitudClaseBCapaCExito from './pages/SolicitudClaseBCapaCExito';
import { SolicitudClaseBCapaCProvider } from './contexts/SolicitudClaseBCapaCContext';

// Materia Prima
import SolicitudImportacionMateriaPrimaFase01 from './pages/SolicitudImportacionMateriaPrimaFase01';
import SolicitudImportacionMateriaPrimaFase02 from './pages/SolicitudImportacionMateriaPrimaFase02';
import SolicitudImportacionMateriaPrimaExito from './pages/SolicitudImportacionMateriaPrimaExito';

// Medicamentos
import SolicitudImportacionMedicamentosFase01 from './pages/SolicitudImportacionMedicamentosFase01';
import SolicitudImportacionMedicamentosFase02 from './pages/SolicitudImportacionMedicamentosFase02';
import SolicitudImportacionMedicamentosExito from './pages/SolicitudImportacionMedicamentosExito';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SolicitudClaseAProvider>
          <SolicitudClaseBProvider>
            <SolicitudClaseBCapaCProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/pre-register" element={<PreRegister />} />
                <Route path="/register" element={<Navigate to="/pre-register" replace />} />
                <Route path="/pre-data" element={<CompleteRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Root route - redirects based on role */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <RoleBasedRedirect />
                    </ProtectedRoute>
                  }
                />

                {/* Role-specific dashboard routes */}
                <Route
                  path="/cliente"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <ClienteDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/ventanilla"
                  element={
                    <ProtectedRoute allowedRoles={['ventanilla']}>
                      <VentanillaDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/tecnico-controlados"
                  element={
                    <ProtectedRoute allowedRoles={['tecnico_controlados']}>
                      <TecnicoControladosDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/director-controlados"
                  element={
                    <ProtectedRoute allowedRoles={['director_controlados']}>
                      <DirectorControladosDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/direccion"
                  element={
                    <ProtectedRoute allowedRoles={['direccion']}>
                      <DireccionDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dncd"
                  element={
                    <ProtectedRoute allowedRoles={['dncd']}>
                      <DncdDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Shared protected routes (accessible by multiple roles) */}
                <Route
                  path="/support"
                  element={
                    <ProtectedRoute>
                      <Support />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/requests"
                  element={
                    <ProtectedRoute>
                      <Requests />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/requests/:id/details"
                  element={
                    <ProtectedRoute>
                      <RequestDetail />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/requests/:status"
                  element={
                    <ProtectedRoute>
                      <RequestsFiltered />
                    </ProtectedRoute>
                  }
                />

                {/* Solicitud Drogas Clase A flow */}
                <Route
                  path="/solicitud-drogas-clase-a"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudDrogasClaseAForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-a/documentos"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudDrogasClaseA />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-a/documentos-renovacion"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudDrogasClaseARenovacion />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-a/exito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudEnviadaExito />
                    </ProtectedRoute>
                  }
                />

                {/* Solicitud Drogas Clase B flow */}
                <Route
                  path="/solicitud-drogas-clase-b"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudDrogasClaseBForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-b/fase-2"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudDrogasClaseBForm2 />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-b/documentos"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudDrogasClaseB />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-drogas-clase-b/exito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudDrogasClaseBExito />
                    </ProtectedRoute>
                  }
                />

                {/* Solicitud Clase B Capa C flow */}
                <Route
                  path="/solicitud-clase-b-capa-c"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudClaseBCapaCForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-clase-b-capa-c/actividades"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudClaseBCapaCActividadesForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-clase-b-capa-c/documentos"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudClaseBCapaC />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-clase-b-capa-c/exito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudClaseBCapaCExito />
                    </ProtectedRoute>
                  }
                />

                {/* Solicitud Importación Materia Prima flow */}
                <Route
                  path="/solicitud-importacion-materia-prima"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMateriaPrimaFase01 />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-importacion-materia-prima/fase-2"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMateriaPrimaFase02 />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-importacion-materia-prima/exito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMateriaPrimaExito />
                    </ProtectedRoute>
                  }
                />

                {/* Solicitud Importación Medicamentos flow */}
                <Route
                  path="/solicitud-importacion-medicamentos"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMedicamentosFase01 />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-importacion-medicamentos/fase-2"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMedicamentosFase02 />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-importacion-medicamentos/exito"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <SolicitudImportacionMedicamentosExito />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy redirects */}
                <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
              </Routes>

            </SolicitudClaseBCapaCProvider>
          </SolicitudClaseBProvider>
        </SolicitudClaseAProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
