const jwt = require ('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao_dev'; 
const JWT_EXPIRES = '30d'; // Token expira em 30 dias


const generateToken = (id, role) => {
    return jwt.sign(
        { id, role }, 
        JWT_SECRET,   
        { expiresIn: JWT_EXPIRES } 
    );
};

module.exports = generateToken;