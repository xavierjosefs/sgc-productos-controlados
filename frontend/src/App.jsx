import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
import RequestsFiltered from './pages/RequestsFiltered';
import SolicitudImportacionMedicamentosFase01 from './pages/SolicitudImportacionMedicamentosFase01';
import SolicitudImportacionMedicamentosFase02 from './pages/SolicitudImportacionMedicamentosFase02';
import SolicitudImportacionMedicamentosExito from './pages/SolicitudImportacionMedicamentosExito';
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
          path="/solicitud-importacion-medicamentos/fase-01"
          element={
            <ProtectedRoute>
              <SolicitudImportacionMedicamentosFase01 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitud-importacion-medicamentos/fase-02"
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
      </Routes>
    </BrowserRouter>
  );
}
