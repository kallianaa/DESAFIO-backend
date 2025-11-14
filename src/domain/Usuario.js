const Role = require("./Role");

class Usuario {
  constructor(id, nome, email, senhaHash, roles = new Set()) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senhaHash = senhaHash;
    this.roles = roles;
  }

  static criar(row, roles = []) {
    const roleObjetos = roles.map(r => new Role(r));
    return new Usuario(
      row.id,
      row.nome,
      row.email,
      row.senha_hash,
      roleObjetos 
    );
  }
 
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      roles: this.roles.map(r => r.nome)
    };
  }
}

module.exports = Usuario;