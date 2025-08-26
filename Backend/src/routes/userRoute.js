const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.params.id}${ext}`);
  },
});
const upload = multer({ storage });

// Rota para atualizar imagem de perfil com arquivo
router.put('/:id/profile-image', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado' });

    const imageUrl = `/uploads/${req.file.filename}`; // URL para acessar a imagem

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: imageUrl },
      { new: true, select: '-password' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({ message: 'Imagem atualizada com sucesso!', profileImage: updatedUser.profileImage });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar imagem', error });
  }
});

module.exports = router;
