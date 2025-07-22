const express = require('express');
const taskRoutes = require('./taskRoute');
const userRoutes = require('./userRoute');
const authRoutes = require('./authRoute');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API TaskTamer no ar!');
});

router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes); 

module.exports = router;
