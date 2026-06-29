const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    email: { type: String, require: true },
    senha : { type: String, require: true }
})

module.exports = mongoose.model('loginModel', loginSchema, 'Usuario')
