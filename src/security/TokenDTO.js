// src/security/TokenDTO.js
class TokenDTO {
  constructor(token, user) {
    this.accessToken = token;
    this.user = user;
  }
}

module.exports = TokenDTO;