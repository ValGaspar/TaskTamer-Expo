const User = require('../models/userModel');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    if (user.password !== password) { // ideal comparar hash aqui
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    res.json({ message: 'Login realizado com sucesso', userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error });
  }
};

module.exports = { loginUser };
