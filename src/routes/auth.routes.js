const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/AuthController');
// Rota para login
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

module.exports = router;
