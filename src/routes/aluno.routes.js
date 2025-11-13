const express = require('express');
const router = express.Router();

// Middleware para autenticação e autorização
const AlunoController = require('../controllers/AlunoController');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

// Todas as rotas abaixo exigem autenticação e role 'ALUNO'
router.use(auth, requireRole('ALUNO'));

// Rota para listar ofertas disponíveis para o aluno
router.get('/ofertas', (req, res) => {
  AlunoController.listarOfertas(req, res);
});


module.exports = router;
