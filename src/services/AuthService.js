const UsuarioRepository = require('../repositories/UsuarioRepository');
const PasswordHasher = require('../security/PasswordHasher');
const JWTProvider = require('../security/JWTProvider');
const RefreshDTO = require('../dtos/RefreshDTO');

class AuthService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  // ===========================
  // LOGIN
  // ===========================
  async login(dto) {
    const user = await this.usuarioRepository.findByEmail(dto.email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const senhaValida = await PasswordHasher.compare(dto.senha, user.senhaHash);

    if (!senhaValida) {
      throw new Error("Credenciais inválidas");
    }

    const roles = [...user.roles].map(r => r.nome);

    const accessToken = JWTProvider.generateAccessToken(user.id, user.email, roles);
    const refreshToken = JWTProvider.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        roles
      }
    };
  }

  // ===========================
  // REFRESH
  // ===========================
  async refresh(refreshToken) {
    try {
      const payload = JWTProvider.verifyRefreshToken(refreshToken);

      const user = await this.usuarioRepository.findById(payload.sub);
      if (!user) throw new Error("Usuário não encontrado");

      const roles = [...user.roles].map(r => r.nome);

      const newAccessToken = JWTProvider.generateAccessToken(
        user.id,
        user.email,
        roles
      );

      return new RefreshDTO(newAccessToken);

    } catch (err) {
      throw new Error("Refresh token inválido ou expirado");
    }
  }
}

module.exports = AuthService;