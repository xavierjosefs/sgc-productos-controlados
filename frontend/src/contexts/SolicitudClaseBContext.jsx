import { createContext, useState, useContext } from 'react';

const SolicitudClaseBContext = createContext();

export function SolicitudClaseBProvider({ children }) {
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const clearFormData = () => {
    setFormData({});
  };

  return (
    <SolicitudClaseBContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </SolicitudClaseBContext.Provider>
  );
}

export function useSolicitudClaseB() {
  const context = useContext(SolicitudClaseBContext);
  if (!context) {
    throw new Error('useSolicitudClaseB debe usarse dentro de SolicitudClaseBProvider');
  }
  return context;
}
