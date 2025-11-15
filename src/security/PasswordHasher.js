// src/security/PasswordHasher.js
const bcrypt = require('bcryptjs');

class PasswordHasher {
  async hash(senha) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }

  async compare(senha, hash) {
    return bcrypt.compare(senha, hash);
  }
}

module.exports = new PasswordHasher();