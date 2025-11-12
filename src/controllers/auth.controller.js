const bcrypt = require('bcryptjs'); 
const generateToken = require('../utils/generateToken'); 


// --------------------------------------------------------------------------------
// --- FUNÇÕES DE ACESSO AO REPOSITÓRIO (MOCK) ---
// ESSAS FUNÇÕES DEVEM SER IMPLEMENTADAS EM repository/user.repository.js PARA RODAR SQL.
// --------------------------------------------------------------------------------

// Simula a busca de usuário no PostgreSQL (DEVE RETORNAR A SENHA_HASH).

const findUserByEmail = async (email) => {
    // Implemente a consulta SQL: SELECT id, nome, email, senha_hash, role FROM "Usuario" WHERE email = $1

    console.log(`[DB Placeholder] Buscando usuário com email: ${email}`);
    
    // MOCK DATA PARA TESTE DO LOGIN:
    if (email === 'instituicao@projeto.com') {
        // Hash de 'password123'
        return { 
            id: '264b360a-5c2f-413e-a19e-e39546059d4c', 
            email: email, 
            nome: 'Administrador',
            senha_hash: '$2a$10$wI3660Y9wB/p0YxV6wE0AexmEwXgLw2kQh0gZk3FjJk6LzT/v6y0a', 
            role: 'ADMIN' 
        };
    }
    return null; 
};


 // Simula a criação de usuário no PostgreSQL.
 
const createUser = async (nome, email, senha_hash, roleName) => {
    // Implemente: INSERT na "Usuario" e INSERT na "UsuarioRole".
    const newId = require('crypto').randomUUID(); 
    console.log(`[DB Placeholder] Criando novo usuário ID: ${newId} com Role: ${roleName}`);
    
    return { 
        id: newId, 
        email, 
        nome,
        role: roleName 
    };
};


// Registrar um novo usuário (Aluno, Professor, ou Instituição)
// POST /api/auth/register
const registerUser = async (req, res) => {
    const { nome, email, senha, role } = req.body; 

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos: nome, email e senha.' });
    }

    try {
        const userExists = await findUserByEmail(email); 

        if (userExists) {
            return res.status(409).json({ message: 'Este email já está registrado no sistema.' });
        }

        const finalRole = ['ALUNO', 'PROFESSOR', 'ADMIN'].includes(role.toUpperCase()) ? role.toUpperCase() : 'ALUNO';

        
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        
        const user = await createUser(nome, email, senha_hash, finalRole); 


        if (user) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role), 
                message: `Usuário (${user.role}) registrado com sucesso.`
            });
        } else {
            res.status(400).json({ message: 'Dados inválidos do usuário.' });
        }

    } catch (error) {
        console.error('Erro durante o registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor durante o registro.' });
    }
};

// Autenticar um usuário e obter o token
// POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    }

    try {
        
        const user = await findUserByEmail(email); 

        if (user && (await bcrypt.compare(senha, user.senha_hash))) { 
        
            res.json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role), 
                message: 'Login bem-sucedido.'
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas (email ou senha incorretos).' });
        }

    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ message: 'Erro interno do servidor durante o login.' });
    }
};

module.exports = {
    registerUser,
    loginUser 
};