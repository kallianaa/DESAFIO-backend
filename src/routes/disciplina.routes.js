const express = require('express');
const DisciplinaController = require('../controllers/DisciplinaController');

const router = express.Router();
const disciplinaController = new DisciplinaController();

// Get all disciplinas
router.get('/', (req, res) => disciplinaController.getDisciplinas(req, res));

// Create a new disciplina
router.post('/', (req, res) => disciplinaController.postDisciplina(req, res));

// Update an existing disciplina
router.put('/:id', (req, res) => disciplinaController.putDisciplina(req, res));

// Delete a disciplina
router.delete('/:id', (req, res) => disciplinaController.deleteDisciplina(req, res));

module.exports = router;
