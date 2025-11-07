require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  // Add other configuration values here
  // For example:
  // dbUrl: process.env.DATABASE_URL,
  // jwtSecret: process.env.JWT_SECRET,
};