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
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário', error });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
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
