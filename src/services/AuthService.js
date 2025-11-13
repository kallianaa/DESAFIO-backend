const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//  Service responsável pela autenticação do usuário
class AuthService {
  async login(email, senha) {
    const userRes = await db.query(
      'SELECT * FROM "Usuario" WHERE email = $1',
      [email]
    );
    console.log("➡️ Email recebido no login:", email);
    console.log("➡️ Resultado da query:", userRes.rows);

    // Verifica se o usuário existe
    if (userRes.rows.length === 0) {
        console.log("❌ Nenhum usuário encontrado no banco com este email:", email);
        throw new Error('Credenciais inválidas');
    }

    const user = userRes.rows[0];

    // Verifica a senha
    const senhaOK = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaOK) {
      throw new Error('Credenciais inválidas');
    }

    // Busca roles do usuário
    const rolesRes = await db.query(`
      SELECT r.nome
      FROM "UsuarioRole" ur
      JOIN "Role" r ON r.id = ur.role_id
      WHERE ur.usuario_id = $1
    `, [user.id]);

    const roles = rolesRes.rows.map(r => r.nome);

    // Cria o token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        roles,
      }
    };
  }
}

module.exports = AuthService;