import { createContext, useContext, useState } from 'react';

/**
 * Context para compartir datos del formulario de Solicitud Clase A
 * entre SolicitudDrogasClaseAForm y DocumentosSolicitudDrogasClaseA
 */
const SolicitudClaseAContext = createContext();

export function SolicitudClaseAProvider({ children }) {
  const [formData, setFormData] = useState({});

  const updateFormData = (data) => {
    setFormData(data);
  };

  const clearFormData = () => {
    setFormData({});
  };

  return (
    <SolicitudClaseAContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </SolicitudClaseAContext.Provider>
  );
}

export function useSolicitudClaseA() {
  const context = useContext(SolicitudClaseAContext);
  if (!context) {
    throw new Error('useSolicitudClaseA must be used within SolicitudClaseAProvider');
  }
  return context;
}
