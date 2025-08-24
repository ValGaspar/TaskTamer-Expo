const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rota pública para registro
router.post('/register', createUser);

// Rotas protegidas
router.get('/', authMiddleware, getAllUsers);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
