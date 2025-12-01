import RequestDetail from './pages/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import Requests from './pages/Requests';
import RequestsFiltered from './pages/RequestsFiltered';
import ProtectedRoute from './components/ProtectedRoute';
import ClientLayout from './layouts/ClientLayout';
// Solicitud Clase B
import SolicitudDrogasClaseBForm from './pages/SolicitudDrogasClaseBForm';
import SolicitudDrogasClaseBForm2 from './pages/SolicitudDrogasClaseBForm2';
import DocumentosSolicitudDrogasClaseB from './pages/DocumentosSolicitudDrogasClaseB';
import SolicitudDrogasClaseBExito from './pages/SolicitudDrogasClaseBExito';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';
import { SolicitudClaseBProvider } from './contexts/SolicitudClaseBContext';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        <Route path="/register" element={<Navigate to="/pre-register" replace />} />
        <Route path="/pre-data" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes - cada p├ígina maneja su propio layout */}
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
            path="/requests/estado/:status"
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

          {/* Solicitud Drogas Clase B flow */}
          <Route
            path="/solicitud-drogas-clase-b"
            element={
              <ProtectedRoute>
                <SolicitudClaseBProvider>
                  <SolicitudDrogasClaseBForm />
                </SolicitudClaseBProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitud-drogas-clase-b/paso-2"
            element={
              <ProtectedRoute>
                <SolicitudClaseBProvider>
                  <SolicitudDrogasClaseBForm2 />
                </SolicitudClaseBProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitud-drogas-clase-b/documentos"
            element={
              <ProtectedRoute>
                <SolicitudClaseBProvider>
                  <DocumentosSolicitudDrogasClaseB />
                </SolicitudClaseBProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitud-drogas-clase-b/exito"
            element={
              <ProtectedRoute>
                <SolicitudClaseBProvider>
                  <SolicitudDrogasClaseBExito />
                </SolicitudClaseBProvider>
              </ProtectedRoute>
            }
          />

          {/* Página de éxito compartida */}
          <Route
            path="/solicitud-exito"
            element={
              <ProtectedRoute>
                <SolicitudEnviadaExito />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}
