import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import RequestsFiltered from './pages/RequestsFiltered';
import SolicitudClaseB from './pages/SolicitudClaseB';
import SolicitudClaseB2 from './pages/SolicitudClaseB2';
import SolicitudClaseB3 from './pages/SolicitudClaseB3';
import SolicitudClaseB4 from './pages/SolicitudClaseB4';
import SolicitudClaseB5 from './pages/SolicitudClaseB5';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
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
        <Route
          path="/solicitud-clase-b"
          element={
            <ProtectedRoute>
              <SolicitudClaseB />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-clase-b-2"
          element={
            <ProtectedRoute>
              <SolicitudClaseB2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-clase-b-3"
          element={
            <ProtectedRoute>
              <SolicitudClaseB3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-clase-b-4"
          element={
            <ProtectedRoute>
              <SolicitudClaseB4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-clase-b-5"
          element={
            <ProtectedRoute>
              <SolicitudClaseB5 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
