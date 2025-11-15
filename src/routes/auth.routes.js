const express = require('express');
<<<<<<< HEAD
const { registerUser, loginUser } = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

router.post('/login', loginUser);

module.exports = router;
// POST /api/
=======
const router = express.Router();
const AuthController = require('../controllers/AuthController');
// Rota para login
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

module.exports = router;
>>>>>>> main
