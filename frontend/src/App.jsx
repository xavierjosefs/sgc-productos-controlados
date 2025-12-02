import RequestDetail from './pages/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import Requests from './pages/Requests';
import RequestsFiltered from './pages/RequestsFiltered';
import ProtectedRoute from './components/ProtectedRoute';
import ClientLayout from './layouts/ClientLayout';
import SolicitudDrogasClaseAForm from './pages/SolicitudDrogasClaseAForm';
import DocumentosSolicitudDrogasClaseA from './pages/DocumentosSolicitudDrogasClaseA';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';
import { SolicitudClaseAProvider } from './contexts/SolicitudClaseAContext';

export default function App() {
  return (
    <BrowserRouter>
      <SolicitudClaseAProvider>
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
            path="/solicitud-drogas-clase-a/exito"
            element={
              <ProtectedRoute>
                <SolicitudEnviadaExito />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
        </Routes>
      </SolicitudClaseAProvider>
    </BrowserRouter>
  );
}
