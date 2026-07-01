const express = require('express')
const loginController = require('../controllers/loginController')

const router = express.Router()

// Cadastrar
router.post('/cadastro', loginController.cadastro)

router.post('/login', loginController.login)

module.exports = router
