import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import RequestsFiltered from './pages/RequestsFiltered';
import SolicitudImportacionMateriaPrimaFase01 from './pages/SolicitudImportacionMateriaPrimaFase01';
import SolicitudImportacionMateriaPrimaFase02 from './pages/SolicitudImportacionMateriaPrimaFase02';
import SolicitudImportacionMateriaPrimaExito from './pages/SolicitudImportacionMateriaPrimaExito';
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

        {/* Solicitud Importación Materia Prima */}
        <Route
          path="/solicitud-importacion-materia-prima/fase-01"
          element={
            <ProtectedRoute>
              <SolicitudImportacionMateriaPrimaFase01 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-importacion-materia-prima/fase-02"
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
      </Routes>
    </BrowserRouter>
  );
}
