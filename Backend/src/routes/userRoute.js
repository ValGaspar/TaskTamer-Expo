const express = require('express');
const User = require('../models/userModel'); // rota de imagem
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

// NOVA ROTA: atualizar apenas a imagem de perfil
router.put('/:id/profile-image', authMiddleware, async (req, res) => {
  try {
    const { profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage },
      { new: true, select: '-password' }
    );
    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar imagem', error });
  }
});

module.exports = router;
