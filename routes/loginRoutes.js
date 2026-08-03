const express = require('express')
const loginController = require('../controllers/loginController')
const auth = require('../middlewares/auth')

const router = express.Router()

// Cadastrar
router.post('/cadastro', loginController.cadastro)

// Login
router.post('/login', loginController.login)

// Página do perfil do usuário (privado)
router.get('/perfil', auth, loginController.perfil)

// Página de contato (privado)
router.get('/contato', auth, loginController.contato)

module.exports = router
