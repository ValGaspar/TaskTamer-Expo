const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");

const router = express.Router();

// rota de registro
router.post("/register", registerUser);

// rota de login
router.post("/login", loginUser);

module.exports = router;
