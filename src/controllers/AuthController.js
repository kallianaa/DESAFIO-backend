const AuthService = require("../services/AuthService");
const LoginDTO = require("../security/LoginDTO");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const dto = LoginDTO.fromRequest(req.body);
      const tokenDto = await this.authService.login(dto);
      return res.json(tokenDto);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const tokenDto = await this.authService.refresh(refreshToken);
      return res.json(tokenDto);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  };
}

module.exports = new AuthController();
