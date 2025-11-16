const express = require('express');
const TurmaController = require('../controllers/TurmaController');
const ensureAuth = require('../middlewares/ensureAuth');
const ensureRole = require('../middlewares/ensureRole');

const router = express.Router();
const turmaController = new TurmaController();

// Todas as rotas abaixo exigem autenticação
router.use(auth);

// Get all turmas
router.get('/', ensureAuth, (req, res) => turmaController.getTurmas(req, res));

// Create a new turma
router.post('/', ensureAuth, ensureRole('ADMIN'), (req, res) => turmaController.postTurma(req, res));

// Update an existing turma
router.put('/:id', ensureAuth, ensureRole('ADMIN'), (req, res) => turmaController.putTurma(req, res));

// Detalhes sobre uma turma específica
router.get('/:id', ensureAuth, (req, res) => turmaController.getTurmaById(req, res));

// PROFESSOR vê apenas alunos de suas turmas
router.get('/:id/alunos', ensureAuth, ensureRole('PROFESSOR', 'ADMIN'), (req, res) => turmaController.listarAlunos(req, res));

// Delete a turma
router.delete('/:id', ensureAuth, ensureRole('ADMIN'), (req, res) => turmaController.deleteTurma(req, res));

module.exports = router;