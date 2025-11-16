class LoginDTO {
  constructor(email, senha) {
    this.email = email;
    this.senha = senha;
  }

  static fromRequest(body) {
    return new LoginDTO(body.email, body.senha);
  }
}
module.exports = LoginDTO;
