import RequestDetail from './pages/RequestDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import RequestsFiltered from './pages/RequestsFiltered';
import ProtectedRoute from './components/ProtectedRoute';
import SolicitudDrogasClaseAForm from './pages/SolicitudDrogasClaseAForm';
import DocumentosSolicitudDrogasClaseA from './pages/DocumentosSolicitudDrogasClaseA';
import SolicitudEnviadaExito from './pages/SolicitudEnviadaExito';
import { useState } from 'react';
import ModalConfirmacionEnvio from './components/ModalConfirmacionEnvio';

export default function App() {
  // Estado para navegación entre pantallas del flujo de solicitud
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        {/* Backwards-compatible redirect from /register to /pre-register */}
        <Route path="/register" element={<Navigate to="/pre-register" replace />} />
        <Route path="/pre-data" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
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
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <RequestDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/solicitud-drogas-clase-a"
          element={
            <ProtectedRoute>
              <SolicitudDrogasClaseAForm
                onContinue={() => {
                  window.location.href = '/solicitud-drogas-clase-a/documentos';
                }}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/solicitud-drogas-clase-a/documentos"
          element={
            <ProtectedRoute>
              <>
                <DocumentosSolicitudDrogasClaseA
                  onBack={() => window.location.href = '/solicitud-drogas-clase-a'}
                  onEnviar={() => setModalOpen(true)}
                />
                <ModalConfirmacionEnvio
                  open={modalOpen}
                  onCancel={() => setModalOpen(false)}
                  onConfirm={() => {
                    setModalOpen(false);
                    window.location.href = '/solicitud-drogas-clase-a/exito';
                  }}
                />
              </>
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

        {/* Redirect for old path */}
        <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
