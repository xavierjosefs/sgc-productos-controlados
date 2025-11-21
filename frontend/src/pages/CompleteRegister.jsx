import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompleteRegister() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preData, setPreData] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Traer datos del backend usando el token
  useEffect(() => {
    if (!token) {
      setError("Token no encontrado en la URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching pre-data with token:", token);
        const res = await axios.get(
          `${baseURL}/api/auth/pre-data?token=${token}`
        );
        console.log("Pre-data response:", res.data);

        setPreData(res.data);
      } catch (err) {
        setError("Este enlace es inválido o ha expirado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register-complete",
        {
          token,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess("Registro completado correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Hubo un error al completar el registro.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-5 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-md bg-white">
      <h1 className="text-2xl font-semibold mb-4">Completar Registro</h1>

      <p className="mb-4 text-gray-700">
        Hola <strong>{preData.full_name}</strong>, confirma tu contraseña para
        completar tu registro con el correo:
        <br />
        <strong>{preData.email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Contraseña:</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 mb-3 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-600 mb-3 text-sm">{success}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
