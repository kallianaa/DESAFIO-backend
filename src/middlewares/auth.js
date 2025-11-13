const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token inválido ou mal formatado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // payload = { sub: user.id, email: user.email, roles: [...] }
    req.user = payload; // to use later in the request lifecycle

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};