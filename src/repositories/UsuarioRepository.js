const db = require('../config/database');
const Usuario = require('../domain/Usuario');

class UsuarioRepository {

  // ------------------------
  // FINDERS
  // ------------------------
  async findByEmail(email) {
    const result = await db.query(
      `SELECT * FROM "Usuario" WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) return null;

    const userRow = result.rows[0];
    const roles = await this.getRoles(userRow.id);

    return Usuario.criar(userRow, roles);
  }

  async findById(id) {
    const result = await db.query(
      `SELECT * FROM "Usuario" WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const userRow = result.rows[0];
    const roles = await this.getRoles(userRow.id);

    return Usuario.criar(userRow, roles);
  }

  async findAll() {
    const result = await db.query(`SELECT * FROM "Usuario"`);

    const usuarios = [];
    for (const row of result.rows) {
      const roles = await this.getRoles(row.id);
      usuarios.push(Usuario.criar(row, roles));
    }

    return usuarios;
  }


  // ------------------------
  // CREATE
  // ------------------------
  async create({ nome, email, senhaHash }) {
    const result = await db.query(`
      INSERT INTO "Usuario" (nome, email, senha_hash)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [nome, email, senhaHash]);

    const usuario = result.rows[0];

    // por padrão, todo usuário criado recebe a role ALUNO (opcional)
    await this.assignRole(usuario.id, "ALUNO");

    return Usuario.criar(usuario, ["ALUNO"]);
  }


  // ------------------------
  // UPDATE
  // ------------------------
  async update(id, { nome, email }) {
    const result = await db.query(`
      UPDATE "Usuario"
      SET nome = $1,
          email = $2
      WHERE id = $3
      RETURNING *
    `, [nome, email, id]);

    if (result.rows.length === 0) return null;

    const userRow = result.rows[0];
    const roles = await this.getRoles(id);

    return Usuario.criar(userRow, roles);
  }

  async updatePassword(id, senhaHash) {
    await db.query(`
      UPDATE "Usuario"
      SET senha_hash = $1
      WHERE id = $2
    `, [senhaHash, id]);
  }


  // ------------------------
  // DELETE
  // ------------------------
  async delete(id) {
    // Remover as roles primeiro
    await db.query(`DELETE FROM "UsuarioRole" WHERE usuario_id = $1`, [id]);

    // Agora pode remover o usuário
    await db.query(`DELETE FROM "Usuario" WHERE id = $1`, [id]);
}

  
  // ------------------------
  // ROLES
  // ------------------------
  async getRoles(userId) {
    const result = await db.query(`
      SELECT r.nome
      FROM "UsuarioRole" ur
      JOIN "Role" r ON r.id = ur.role_id
      WHERE ur.usuario_id = $1
    `, [userId]);

    return result.rows.map(r => r.nome);
  }

  async assignRole(userId, roleName) {
    const roleResult = await db.query(`
      SELECT id FROM "Role" WHERE nome = $1
    `, [roleName]);

    if (roleResult.rows.length === 0)
      throw new Error('Role não existe');

    const roleId = roleResult.rows[0].id;

    await db.query(`
        INSERT INTO "UsuarioRole" (usuario_id, role_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `, [userId, roleId]);
  }
}

module.exports = UsuarioRepository;