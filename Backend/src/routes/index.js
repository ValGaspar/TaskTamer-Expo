const express = require('express');
const taskRoutes = require('./taskRoute');
const userRoutes = require('./userRoute');
const authRoutes = require('./authRoute');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => res.send('API TaskTamer no ar!'));

// rotas públicas
router.use('/auth', authRoutes);       // login
router.use('/users', userRoutes);      // register pública, outras protegidas

// rotas protegidas
router.use('/tasks', authMiddleware, taskRoutes);

module.exports = router;
