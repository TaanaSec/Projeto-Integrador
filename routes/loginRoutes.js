const express = require('express')
const loginController = require('../controllers/loginController')
const auth = require('../middlewares/auth')

const router = express.Router()

// Cadastrar
router.post('/cadastro', loginController.cadastro)

router.post('/login', loginController.login)

router.get('/perfil', auth, loginController.perfil)

module.exports = router
