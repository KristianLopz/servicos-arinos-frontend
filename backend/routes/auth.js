const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, registerValidation, loginValidation } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', registerValidation, register);   // CU01
router.post('/login', loginValidation, login);             // CU02
router.post('/logout', authenticate, logout);              // RF02
router.post('/forgot-password', forgotPassword);           // CU02 FA3

module.exports = router;
