const jwt = require('jsonwebtoken');
const JWTProvider = require("../security/JWTProvider");
console.log("SECRET usada na validação:", JWTProvider.JWT_SECRET);

module.exports = function auth(req, res, next) {
  console.log("🔍 Authorization recebido:", req.headers.authorization);

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token inválido ou mal formatado" });
  }

  try {
    const payload = jwt.verify(token, JWTProvider.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
};
