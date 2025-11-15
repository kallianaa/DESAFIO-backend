// src/security/UsuarioDTO.js
class UsuarioDTO {
  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  static fromRequest(body) {
    return new UsuarioDTO(body.nome, body.email, body.senha);
  }
}

module.exports = UsuarioDTO;
