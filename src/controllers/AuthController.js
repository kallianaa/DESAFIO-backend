  const AuthService = require('../services/AuthService');

  class AuthController {
    constructor() {
      this.authService = new AuthService();
    }

    login = async (req, res) => {
      try {
        const { email, senha } = req.body;

        if (!email || !senha) {
          return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        const data = await this.authService.login(email, senha);
        return res.json(data);

      } catch (error) {
        return res.status(401).json({ message: error.message });
      }
    }
  }

  module.exports = new AuthController();