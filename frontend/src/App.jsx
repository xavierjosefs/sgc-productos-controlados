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
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        <Route path="/pre-data" element={<CompleteRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
          {/* Detalle de solicitud por ID */}
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />

        {/* Flujo de solicitud de drogas controladas clase A */}
        <Route
          path="/solicitud-drogas-clase-a"
          element={
            <ProtectedRoute>
              <SolicitudDrogasClaseAForm onContinue={() => {
                window.location.href = '/solicitud-drogas-clase-a/documentos';
              }} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-drogas-clase-a/documentos"
          element={
            <ProtectedRoute>
              <DocumentosSolicitudDrogasClaseA
                onBack={() => window.location.href = '/solicitud-drogas-clase-a'}
                onEnviar={() => {
                  setModalOpen(true);
                }}
              />
              <ModalConfirmacionEnvio
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onConfirm={() => {
                  setModalOpen(false);
                  window.location.href = '/solicitud-drogas-clase-a/exito';
                }}
              />
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
        {/* Redirección para "Mis Solicitudes" */}
        <Route
          path="/mis-solicitudes"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
