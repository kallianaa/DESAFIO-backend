const express = require('express');
const DisciplinaController = require('../controllers/DisciplinaController');
const ensureRole = require('../middlewares/ensureRole');
const ensureAuth = require('../middlewares/ensureAuth');

const router = express.Router();
const disciplinaController = new DisciplinaController();

// All routes below require authentication
router.use(ensureAuth);

// Get all disciplinas (every role is allowed)
router.get('/', (req, res) => disciplinaController.getDisciplinas(req, res));

// Create a new disciplina (ADMIN only)
router.post('/', ensureRole('ADMIN'), (req, res) => disciplinaController.postDisciplina(req, res));

// Update an existing disciplina (ADMIN only)
router.put('/:id', ensureRole('ADMIN'), (req, res) => disciplinaController.putDisciplina(req, res));

// Delete a disciplina (ADMIN only)
router.delete('/:id', ensureRole('ADMIN'), (req, res) => disciplinaController.deleteDisciplina(req, res));

module.exports = router;
