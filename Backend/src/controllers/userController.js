const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação de senha 
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'A senha deve ter no mínimo 5 caracteres, incluindo pelo menos uma letra e um número.'
    });
  }

  try {
    // cadastro de e-mail
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // novo user e senha 
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário', error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, profileImage },
      { new: true, select: '-password' }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar usuário', error });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar usuário', error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
