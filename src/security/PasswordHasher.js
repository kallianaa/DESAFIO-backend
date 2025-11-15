// src/security/PasswordHasher.js
const bcrypt = require('bcryptjs');

class PasswordHasher {
  async hash(plain) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }

  async compare(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}

module.exports = new PasswordHasher();