const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');

// middlewares
const ensureAuth = require('../middlewares/ensureAuth');
const ensureRole = require('../middlewares/ensureRole');

// ===============================
// Rotas autenticadas abaixo
// ===============================
router.use(ensureAuth);

// Criar Aluno (ADMIN)
router.post('/', ensureAuth, ensureRole('ADMIN'), async (req, res) => {
  try {
    const { usuario_id, ra } = req.body;

    const result = await db.query(
      `INSERT INTO "Aluno" (id, ra) VALUES ($1, $2) RETURNING *`,
      [usuario_id, ra]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Criar Professor (ADMIN)
router.post('/', ensureAuth, ensureRole('ADMIN'), async (req, res) => {
  try {
    const { usuario_id, siape } = req.body;

    const result = await db.query(
      `INSERT INTO "Aluno" (id, siape) VALUES ($1, $2) RETURNING *`,
      [usuario_id, siape]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN lista todos os usuários
router.get(
  '/',
  ensureRole('ADMIN'),
  (req, res) => UsuarioController.listar(req, res)
);

// ADMIN buscar por ID
router.get('/:id', (req, res) => {
  if (req.user.roles.includes('ADMIN') || req.user.id === req.params.id) {
    return UsuarioController.buscarPorId(req, res);
  }
  return res.status(403).json({ message: 'Acesso negado' });
});

// ADMIN ou próprio usuário → atualizar
router.put(
  '/:id',
  (req, res) => UsuarioController.atualizar(req, res)
);

// próprio usuário → alterar senha
router.put(
  '/:id/senha',
  (req, res) => UsuarioController.alterarSenha(req, res)
);

// ADMIN → deletar usuário
router.delete(
  '/:id',
  ensureRole('ADMIN'),
  (req, res) => UsuarioController.deletar(req, res)
);

module.exports = router;
