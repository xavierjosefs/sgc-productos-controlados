import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PreRegister from './pages/PreRegister';
import CompleteRegister from './pages/CompleteRegister';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Support from './pages/Support';
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
          path="/requests/:id"
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
      </Routes>
    </BrowserRouter>
  );
}
