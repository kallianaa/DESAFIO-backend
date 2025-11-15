const jwt = require("jsonwebtoken");

class JWTProvider {
  static JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  static REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

  static JWT_EXPIRATION = "15m";  // Access Token
  static REFRESH_EXPIRATION = "7d"; // Refresh Token

  // -------------------------
  // Gera um Access Token
  // -------------------------
  static generateAccessToken(userId, email, roles) {
    return jwt.sign(
      { sub: userId, email, roles },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRATION }
    );
  }

  // -------------------------
  // Gera um Refresh Token
  // -------------------------
  static generateRefreshToken(userId) {
    return jwt.sign(
      { sub: userId },
      this.REFRESH_SECRET,
      { expiresIn: this.REFRESH_EXPIRATION }
    );
  }

  // -------------------------
  // Valida refresh token
  // -------------------------
  static verifyRefreshToken(token) {
    return jwt.verify(token, this.REFRESH_SECRET);
  }
}

module.exports = JWTProvider;
