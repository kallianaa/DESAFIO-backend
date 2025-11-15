const express = require('express');
const TurmaController = require('../controllers/TurmaController');

const router = express.Router();
const turmaController = new TurmaController();

// Get all turmas
router.get('/', (req, res) => turmaController.getTurmas(req, res));

// Create a new turma
router.post('/', (req, res) => turmaController.postTurma(req, res));

// Update an existing turma
router.put('/:id', (req, res) => turmaController.putTurma(req, res));

// Delete a turma
router.delete('/:id', (req, res) => turmaController.deleteTurma(req, res));

module.exports = router;