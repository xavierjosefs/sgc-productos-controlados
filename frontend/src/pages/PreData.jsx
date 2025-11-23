import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PreData() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [preData, setPreData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/auth/pre-data?token=${token}`)
      .then(res => setPreData(res.data))
      .catch(() => alert("Token inválido o expirado"));
  }, [token]);

  if (!preData) return <p>Cargando...</p>;

  return (
    <PasswordForm token={token} email={preData.email} />
  );
}
