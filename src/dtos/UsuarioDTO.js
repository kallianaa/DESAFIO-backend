// src/security/UsuarioDTO.js
class UsuarioDTO {
  constructor(nome, email, senha, role) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.role = role;
  }

  static fromRequest(body) {
    return new UsuarioDTO(body.nome, body.email, body.senha, body.role);
  }
}

module.exports = UsuarioDTO;
