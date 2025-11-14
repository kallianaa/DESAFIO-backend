const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const auth = require('../security/authenticate');
const requireRole = require('../security/authorizeRole');

// Registro (público)
router.post('/', (req, res) => UsuarioController.criar(req, res));

// autenticadas
router.use(auth);

// ADMIN → listar todos
router.get('/', requireRole('ADMIN'), (req, res) =>
  UsuarioController.listar(req, res)
);

// ADMIN ou próprio usuário → buscar por ID
router.get('/:id', (req, res) => UsuarioController.buscarPorId(req, res));

// ADMIN ou próprio usuário → atualizar usuário
router.put('/:id', (req, res) => UsuarioController.atualizar(req, res));

// próprio usuário → mudar senha
router.put('/:id/senha', (req, res) =>
  UsuarioController.alterarSenha(req, res)
);

// ADMIN → deletar usuário
router.delete('/:id', requireRole('ADMIN'), (req, res) =>
  UsuarioController.deletar(req, res)
);

module.exports = router;
