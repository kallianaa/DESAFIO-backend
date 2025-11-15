const express = require('express');
const router = express.Router();

// Middleware para autenticação e autorização
const TurmaController = require('../controllers/TurmaController');
const auth = require('../security/authenticate');
const requireRole = require('../security/authorizeRole');

// Todas as rotas abaixo exigem autenticação e role 'ALUNO'
router.use(auth, requireRole('ALUNO'));

// Rota para listar ofertas disponíveis para o aluno
router.get('/ofertas', (req, res) => {
  TurmaController.listarOfertas(req, res);
});


module.exports = router;
