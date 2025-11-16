// src/security/TokenDTO.js
class TokenDTO {
  constructor(token, refreshToken, user) {
    this.accessToken = token;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}

module.exports = TokenDTO;