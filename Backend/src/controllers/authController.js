const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// criar tokens
const generateTokens = (userId, name) => {
  const accessToken = jwt.sign({ userId, name }, process.env.JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign({ userId, name }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta' });

    const { accessToken, refreshToken } = generateTokens(user._id, user.name);

    res.json({
      message: 'Login realizado com sucesso',
      accessToken,
      refreshToken,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error });
  }
};

// gerar novo access token usando refresh token
const refreshAccessToken = (req, res) => {
  const { token } = req.body; // token = refreshToken
  if (!token) return res.status(401).json({ message: 'Refresh token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId, name: decoded.name },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token inválido ou expirado' });
  }
};

module.exports = { loginUser, registerUser, refreshAccessToken };
