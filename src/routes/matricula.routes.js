// src/routes/matricula.routes.js
const { Router } = require('express');
const MatriculaController = require('../controllers/MatriculaController');
const authenticate = require('../middlewares/ensureAuth');

const router = Router();

console.log('[matriculaRoutes] loaded - authenticate present:', !!authenticate, 'MatriculaController:', !!MatriculaController);

// rota para minhas matrículas (lista do usuário autenticado)
router.get('/minhas', authenticate, MatriculaController.getMinhasMatriculas);

// rota raiz (lista)
router.get('/', authenticate, MatriculaController.getAll);

// rota para criar matrícula
router.post('/', authenticate, MatriculaController.post);

// rota específica primeiro (evita conflito com /:id)
router.get('/aluno/:alunoId/disponiveis', authenticate, MatriculaController.getTurmasDisponiveis);

// rota por id por último
router.get('/:id', authenticate, MatriculaController.getById);

// delete por id
router.delete('/:id', authenticate, MatriculaController.delete);

module.exports = router;
