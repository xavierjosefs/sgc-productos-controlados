import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import RequestsFiltered from './pages/RequestsFiltered';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import ProtectedRoute from './components/ProtectedRoute';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';

// Solicitud Drogas Clase B Capa C
import { SolicitudClaseBCapaCProvider } from './contexts/SolicitudClaseBCapaCContext';
import SolicitudClaseBCapaCActividadesForm from './pages/SolicitudClaseBCapaCActividadesForm';
import SolicitudClaseBCapaCForm from './pages/SolicitudClaseBCapaCForm';
import DocumentosSolicitudClaseBCapaC from './pages/DocumentosSolicitudClaseBCapaC';
import SolicitudClaseBCapaCExito from './pages/SolicitudClaseBCapaCExito';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        <Route path="/pre-data" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rutas protegidas - Cliente */}
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
          path="/requests/:status"
          element={
            <ProtectedRoute>
              <RequestsFiltered />
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
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetail />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Solicitud Drogas Clase B Capa C */}
        <Route
          path="/solicitud-drogas-clase-b-capa-c"
          element={
            <ProtectedRoute>
              <SolicitudClaseBCapaCProvider>
                <SolicitudClaseBCapaCActividadesForm />
              </SolicitudClaseBCapaCProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-drogas-clase-b-capa-c/paso-2"
          element={
            <ProtectedRoute>
              <SolicitudClaseBCapaCProvider>
                <SolicitudClaseBCapaCForm />
              </SolicitudClaseBCapaCProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-drogas-clase-b-capa-c/documentos"
          element={
            <ProtectedRoute>
              <SolicitudClaseBCapaCProvider>
                <DocumentosSolicitudClaseBCapaC />
              </SolicitudClaseBCapaCProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-drogas-clase-b-capa-c/exito"
          element={
            <ProtectedRoute>
              <SolicitudClaseBCapaCExito />
            </ProtectedRoute>
          }
        />

        {/* Ruta compartida de éxito */}
        <Route
          path="/solicitud-exito"
          element={
            <ProtectedRoute>
              <SolicitudEnviadaExito />
            </ProtectedRoute>
          }
        />

        {/* Redirect para compatibilidad */}
        <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
