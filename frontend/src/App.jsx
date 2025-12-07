import RequestDetail from './pages/cliente/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Support from './pages/cliente/Support';
import Requests from './pages/cliente/Requests';
import RequestsFiltered from './pages/cliente/RequestsFiltered';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

import { AuthProvider } from './context/AuthContext';

// Role-specific dashboards
import ClienteDashboard from './pages/cliente/Dashboard';
import Home from './pages/cliente/Dashboard'; // Alias for compatibility
import VentanillaDashboard from './pages/ventanilla/Dashboard';
import VentanillaRequestDetail from './pages/ventanilla/RequestDetail';
import TecnicoControladosDashboard from './pages/tecnico-controlados/Dashboard';
import DirectorControladosDashboard from './pages/director-controlados/Dashboard';
import DireccionDashboard from './pages/direccion/Dashboard';
import DncdDashboard from './pages/dncd/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminSolicitudes from './pages/admin/AdminSolicitudes';
import AdminSolicitudDetalle from './pages/admin/AdminSolicitudDetalle';
import AdminEmpleados from './pages/admin/AdminEmpleados';
import AdminEmpleadoCrear from './pages/admin/AdminEmpleadoCrear';
import AdminEmpleadoEditar from './pages/admin/AdminEmpleadoEditar';
import AdminEmpleadoDetalle from './pages/admin/AdminEmpleadoDetalle';
import AdminServicios from './pages/admin/AdminServicios';
import AdminServicioCrear from './pages/admin/AdminServicioCrear';
import AdminServicioDetalle from './pages/admin/AdminServicioDetalle';
import AdminServicioEditar from './pages/admin/AdminServicioEditar';

// Clase A
import SolicitudDrogasClaseAForm from './pages/cliente/SolicitudDrogasClaseAForm';
import DocumentosSolicitudDrogasClaseA from './pages/cliente/DocumentosSolicitudDrogasClaseA';
import DocumentosSolicitudDrogasClaseARenovacion from './pages/cliente/DocumentosSolicitudDrogasClaseARenovacion';
import DocumentosSolicitudDrogasClaseARoboPerdida from './pages/cliente/DocumentosSolicitudDrogasClaseARoboPerdida';
import SolicitudEnviadaExito from './pages/cliente/SolicitudEnviadaExito';
import { SolicitudClaseAProvider } from './contexts/SolicitudClaseAContext';

// Clase B
import SolicitudDrogasClaseBForm from './pages/cliente/SolicitudDrogasClaseBForm';
import SolicitudDrogasClaseBForm2 from './pages/cliente/SolicitudDrogasClaseBForm2';
import DocumentosSolicitudDrogasClaseB from './pages/cliente/DocumentosSolicitudDrogasClaseB';
import DocumentosSolicitudDrogasClaseBRoboPerdida from './pages/cliente/DocumentosSolicitudDrogasClaseBRoboPerdida';
import SolicitudDrogasClaseBExito from './pages/cliente/SolicitudDrogasClaseBExito';
import { SolicitudClaseBProvider } from './contexts/SolicitudClaseBContext';

// Clase B Capa C
import SolicitudClaseBCapaCForm from './pages/cliente/SolicitudClaseBCapaCForm';
import SolicitudClaseBCapaCActividadesForm from './pages/cliente/SolicitudClaseBCapaCActividadesForm';
import DocumentosSolicitudClaseBCapaC from './pages/cliente/DocumentosSolicitudClaseBCapaC';
import DocumentosSolicitudClaseBCapaCRoboPerdida from './pages/cliente/DocumentosSolicitudClaseBCapaCRoboPerdida';
import DocumentosSolicitudClaseBCapaCRenovacion from './pages/cliente/DocumentosSolicitudClaseBCapaCRenovacion';
import SolicitudClaseBCapaCExito from './pages/cliente/SolicitudClaseBCapaCExito';
import { SolicitudClaseBCapaCProvider } from './contexts/SolicitudClaseBCapaCContext';

// Materia Prima
import SolicitudImportacionMateriaPrimaFase01 from './pages/cliente/SolicitudImportacionMateriaPrimaFase01';
import SolicitudImportacionMateriaPrimaFase02 from './pages/cliente/SolicitudImportacionMateriaPrimaFase02';
import SolicitudImportacionMateriaPrimaExito from './pages/cliente/SolicitudImportacionMateriaPrimaExito';

// Medicamentos
import SolicitudImportacionMedicamentosFase01 from './pages/cliente/SolicitudImportacionMedicamentosFase01';
import SolicitudImportacionMedicamentosFase02 from './pages/cliente/SolicitudImportacionMedicamentosFase02';
import SolicitudImportacionMedicamentosExito from './pages/cliente/SolicitudImportacionMedicamentosExito';

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
                  path="/ventanilla/solicitud/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ventanilla']}>
                      <VentanillaRequestDetail />
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

                {/* Admin routes with layout */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="solicitudes" element={<AdminSolicitudes />} />
                  <Route path="solicitudes/:id" element={<AdminSolicitudDetalle />} />
                  <Route path="empleados" element={<AdminEmpleados />} />
                  <Route path="empleados/crear" element={<AdminEmpleadoCrear />} />
                  <Route path="empleados/:id" element={<AdminEmpleadoDetalle />} />
                  <Route path="empleados/:id/editar" element={<AdminEmpleadoEditar />} />
                  <Route path="servicios" element={<AdminServicios />} />
                  <Route path="servicios/crear" element={<AdminServicioCrear />} />
                  <Route path="servicios/:id" element={<AdminServicioDetalle />} />
                  <Route path="servicios/:id/editar" element={<AdminServicioEditar />} />
                </Route>

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
                  path="/solicitud-drogas-clase-a/documentos-robo-perdida"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudDrogasClaseARoboPerdida />
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
                  path="/solicitud-drogas-clase-b/documentos-robo-perdida"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudDrogasClaseBRoboPerdida />
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
                  path="/solicitud-clase-b-capa-c/documentos-robo-perdida"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudClaseBCapaCRoboPerdida />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/solicitud-clase-b-capa-c/documentos-renovacion"
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DocumentosSolicitudClaseBCapaCRenovacion />
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
