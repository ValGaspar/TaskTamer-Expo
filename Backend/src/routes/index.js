const express = require('express');
const taskRoutes = require('./taskRoute');
const userRoutes = require('./userRoute');
const authRoutes = require('./authRoute');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API TaskTamer no ar!');
});

router.use('/auth', authRoutes); 

router.use('/tasks', authMiddleware, taskRoutes);
router.use('/users', authMiddleware, userRoutes);

module.exports = router;
