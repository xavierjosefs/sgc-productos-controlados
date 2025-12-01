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
import SolicitudImportacionMateriaPrimaFase01 from './pages/SolicitudImportacionMateriaPrimaFase01';
import SolicitudImportacionMateriaPrimaFase02 from './pages/SolicitudImportacionMateriaPrimaFase02';
import SolicitudImportacionMateriaPrimaExito from './pages/SolicitudImportacionMateriaPrimaExito';
import { SolicitudMateriaPrimaProvider } from './contexts/SolicitudMateriaPrimaContext';

export default function App() {
  return (
    <BrowserRouter>
      <SolicitudMateriaPrimaProvider>
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

          {/* Solicitud Importacion Materia Prima flow */}
          <Route
            path="/solicitud-importacion-materia-prima"
            element={
              <ProtectedRoute>
                <SolicitudImportacionMateriaPrimaFase01 />
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitud-importacion-materia-prima/fase02"
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

          {/* Legacy redirects */}
          <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
        </Routes>
      </SolicitudMateriaPrimaProvider>
    </BrowserRouter>
  );
}
