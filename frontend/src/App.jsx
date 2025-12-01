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
import SolicitudDrogasClaseBForm from './pages/SolicitudDrogasClaseBForm';
import SolicitudDrogasClaseBForm2 from './pages/SolicitudDrogasClaseBForm2';
import SolicitudDrogasClaseBExito from './pages/SolicitudDrogasClaseBExito';
import { SolicitudClaseBProvider } from './contexts/SolicitudClaseBContext';

export default function App() {
  return (
    <BrowserRouter>
      <SolicitudClaseBProvider>
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
            path="/solicitud-drogas-clase-b/form2"
            element={
              <ProtectedRoute>
                <SolicitudDrogasClaseBForm2 />
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

          {/* Legacy redirects */}
          <Route path="/mis-solicitudes" element={<Navigate to="/" replace />} />
        </Routes>
      </SolicitudClaseBProvider>
    </BrowserRouter>
  );
}
