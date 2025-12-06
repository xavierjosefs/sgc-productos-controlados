import RequestDetail from './pages/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
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
import VentanillaRequestDetail from './pages/ventanilla/RequestDetail';
import TecnicoControladosDashboard from './pages/tecnico-controlados/Dashboard';
import DirectorControladosDashboard from './pages/director-controlados/Dashboard';
import DireccionDashboard from './pages/direccion/Dashboard';
import DncdDashboard from './pages/dncd/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Clase A
import SolicitudDrogasClaseAForm from './pages/SolicitudDrogasClaseAForm';
import DocumentosSolicitudDrogasClaseA from './pages/DocumentosSolicitudDrogasClaseA';
import DocumentosSolicitudDrogasClaseARenovacion from './pages/DocumentosSolicitudDrogasClaseARenovacion';
import DocumentosSolicitudDrogasClaseAExtraviado from './pages/DocumentosSolicitudDrogasClaseAExtraviado';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';
import { SolicitudClaseAProvider } from './contexts/SolicitudClaseAContext';

// Clase B
import SolicitudDrogasClaseBForm from './pages/SolicitudDrogasClaseBForm';
import SolicitudDrogasClaseBForm2 from './pages/SolicitudDrogasClaseBForm2';
import DocumentosSolicitudDrogasClaseB from './pages/DocumentosSolicitudDrogasClaseB';
import DocumentosSolicitudDrogasClaseBExtraviado from './pages/DocumentosSolicitudDrogasClaseBExtraviado';
import SolicitudDrogasClaseBExito from './pages/SolicitudDrogasClaseBExito';
import { SolicitudClaseBProvider } from './contexts/SolicitudClaseBContext';

// Clase B Capa C
import SolicitudClaseBCapaCForm from './pages/SolicitudClaseBCapaCForm';
import SolicitudClaseBCapaCActividadesForm from './pages/SolicitudClaseBCapaCActividadesForm';
import DocumentosSolicitudClaseBCapaC from './pages/DocumentosSolicitudClaseBCapaC';
import DocumentosSolicitudClaseBCapaCRenovacion from './pages/DocumentosSolicitudClaseBCapaCRenovacion';
import DocumentosSolicitudClaseBCapaCExtraviado from './pages/DocumentosSolicitudClaseBCapaCExtraviado';
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

              {/* Protected routes - cada página maneja su propio layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

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

              <Route
                path="/requests/:id"
                element={
                  <ProtectedRoute>
                    <RequestDetail />
                  </ProtectedRoute>
                }
              />

              {/* Solicitud Drogas Clase A flow */}
              <Route
                path="/solicitud-drogas-clase-a"
                element={
                  <ProtectedRoute>
                    <SolicitudDrogasClaseAForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-a/documentos"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudDrogasClaseA />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-a/documentos-renovacion"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudDrogasClaseARenovacion />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-a/documentos-extraviado"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudDrogasClaseAExtraviado />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-a/exito"
                element={
                  <ProtectedRoute>
                    <SolicitudEnviadaExito />
                  </ProtectedRoute>
                }
              />

              {/* Solicitud Drogas Clase B flow */}
              <Route
                path="/solicitud-drogas-clase-b"
                element={
                  <ProtectedRoute>
                    <SolicitudDrogasClaseBForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-b/fase-2"
                element={
                  <ProtectedRoute>
                    <SolicitudDrogasClaseBForm2 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-b/documentos"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudDrogasClaseB />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-b/documentos-extraviado"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudDrogasClaseBExtraviado />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-drogas-clase-b/exito"
                element={
                  <ProtectedRoute>
                    <SolicitudDrogasClaseBExito />
                  </ProtectedRoute>
                }
              />

              {/* Solicitud Clase B Capa C flow */}
              <Route
                path="/solicitud-clase-b-capa-c"
                element={
                  <ProtectedRoute>
                    <SolicitudClaseBCapaCForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-clase-b-capa-c/actividades"
                element={
                  <ProtectedRoute>
                    <SolicitudClaseBCapaCActividadesForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-clase-b-capa-c/documentos"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudClaseBCapaC />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-clase-b-capa-c/documentos-renovacion"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudClaseBCapaCRenovacion />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-clase-b-capa-c/documentos-extraviado"
                element={
                  <ProtectedRoute>
                    <DocumentosSolicitudClaseBCapaCExtraviado />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-clase-b-capa-c/exito"
                element={
                  <ProtectedRoute>
                    <SolicitudClaseBCapaCExito />
                  </ProtectedRoute>
                }
              />

              {/* Solicitud Importación Materia Prima flow */}
              <Route
                path="/solicitud-importacion-materia-prima"
                element={
                  <ProtectedRoute>
                    <SolicitudImportacionMateriaPrimaFase01 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-importacion-materia-prima/fase-2"
                element={
                  <ProtectedRoute>
                    <SolicitudImportacionMateriaPrimaFase02 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-importacion-materia-prima/exito"
                element={
                  <ProtectedRoute>
                    <SolicitudImportacionMateriaPrimaExito />
                  </ProtectedRoute>
                }
              />

              {/* Solicitud Importación Medicamentos flow */}
              <Route
                path="/solicitud-importacion-medicamentos"
                element={
                  <ProtectedRoute>
                    <SolicitudImportacionMedicamentosFase01 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-importacion-medicamentos/fase-2"
                element={
                  <ProtectedRoute>
                    <SolicitudImportacionMedicamentosFase02 />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/solicitud-importacion-medicamentos/exito"
                element={
                  <ProtectedRoute>
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
    </BrowserRouter>
  );
}
