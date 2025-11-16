const express = require('express');
const TurmaController = require('../controllers/TurmaController');
const auth = require('../security/authenticate');
const requireRole = require('../security/authorizeRole');

const router = express.Router();
const turmaController = new TurmaController();

// Todas as rotas abaixo exigem autenticação
router.use(auth);

// Get all turmas
router.get('/', (req, res) => turmaController.getTurmas(req, res));

// Create a new turma (ADMIN only)
router.post('/', requireRole('ADMIN'), (req, res) => turmaController.postTurma(req, res));

// Update an existing turma (ADMIN only)
router.put('/:id', requireRole('ADMIN'), (req, res) => turmaController.putTurma(req, res));

// Delete a turma (ADMIN only)
router.delete('/:id', requireRole('ADMIN'), (req, res) => turmaController.deleteTurma(req, res));

module.exports = router;