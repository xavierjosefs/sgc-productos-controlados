import { createContext, useContext, useState } from "react";

const SolicitudClaseBCapaCContext = createContext();

export const useSolicitudClaseBCapaC = () => {
  const context = useContext(SolicitudClaseBCapaCContext);
  if (!context) {
    throw new Error(
      "useSolicitudClaseBCapaC debe ser usado dentro de un SolicitudClaseBCapaCProvider"
    );
  }
  return context;
};

export const SolicitudClaseBCapaCProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Sustancias Controladas
    categoriasSustancias: [],
    codigoGrupo: "",
    designacionSustancias: "",
    
    // Administrador/Propietario
    nombreAdministrador: "",
    direccionAdministrador: "",
    cedulaAdministrador: "",
    rnc: "",
    telefonoAdministrador: "",
    lugarTrabajoAdministrador: "",
    
    // Agente Aduanero
    nombreAgenteAduanero: "",
    direccionAgenteAduanero: "",
    cedulaAgenteAduanero: "",
    rnc2: "",
    telefonoAgenteAduanero: "",
    lugarTrabajoAgenteAduanero: "",
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const clearFormData = () => {
    setFormData({
      categoriasSustancias: [],
      codigoGrupo: "",
      designacionSustancias: "",
      nombreAdministrador: "",
      direccionAdministrador: "",
      cedulaAdministrador: "",
      rnc: "",
      telefonoAdministrador: "",
      lugarTrabajoAdministrador: "",
      nombreAgenteAduanero: "",
      direccionAgenteAduanero: "",
      cedulaAgenteAduanero: "",
      rnc2: "",
      telefonoAgenteAduanero: "",
      lugarTrabajoAgenteAduanero: "",
    });
  };

  return (
    <SolicitudClaseBCapaCContext.Provider
      value={{ formData, updateFormData, clearFormData }}
    >
      {children}
    </SolicitudClaseBCapaCContext.Provider>
  );
};
