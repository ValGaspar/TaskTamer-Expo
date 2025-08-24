const express = require('express');
const { loginUser, registerUser, refreshAccessToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
