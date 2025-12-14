import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // <- aquí te queda: { id, email, role, ... }
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== 7) {
      return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export const ventanillaMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== 2) {
      return res.status(403).json({ error: "Acceso denegado. Solo personal de ventanilla." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export const tecnicoMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== 3) {
      return res.status(403).json({ error: "Acceso denegado. Solo Tecnicos de controlados." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export const directorupcMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    console.log('🔐 directorupcMiddleware - Usuario:', {
      id: decoded?.id,
      email: decoded?.email,
      role: decoded?.role,
      role_name: decoded?.role_name
    });

    // Permitir tanto director_controlados (role 4) como director_tecnico (si existe otro role)
    if (decoded.role !== 4 && decoded.role_name !== 'director_controlados' && decoded.role_name !== 'director_tecnico') {
      console.log('❌ Acceso denegado - Role:', decoded.role, 'Role name:', decoded.role_name);
      return res.status(403).json({ error: "Acceso denegado. Solo Directores Técnicos." });
    }
    
    console.log('✅ Acceso permitido al Director Técnico');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export const direccionMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== 5) {
      return res.status(403).json({ error: "Acceso denegado. Solo personal de Dirección." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

export const dncdMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== 6) {
      return res.status(403).json({ error: "Acceso denegado. Solo personal de DNCD." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}
