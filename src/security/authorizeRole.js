module.exports = function requireRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        message: 'Acesso negado: usuário não autenticado'
      });
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [...req.user.roles];

    const autorizado = userRoles.some(role =>
      rolesPermitidas.includes(role)
    );

    if (!autorizado) {
      return res.status(403).json({
        message: 'Acesso negado: permissão insuficiente'
      });
    }

    next();
  };
};
