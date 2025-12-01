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
