// src/routes/matricula.routes.js
const { Router } = require('express');
const MatriculaController = require('../controllers/MatriculaController');
const authenticate = require('../middlewares/auth'); // note: pasta "middlewares" e middleware exportado como função

const router = Router();

console.log('[matriculaRoutes] loaded - authenticate present:', !!authenticate, 'MatriculaController:', !!MatriculaController);

// rota raiz (lista)
router.get('/', authenticate, MatriculaController.getAll);

// rota específica primeiro (evita conflito com /:id)
router.get('/aluno/:alunoId/disponiveis', authenticate, MatriculaController.getTurmasDisponiveis);

// rota por id por último
router.get('/:id', authenticate, MatriculaController.getById);

module.exports = router;
