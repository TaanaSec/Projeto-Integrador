const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    senha : { type: String, require: true, select: false }
}, { timestamps: true })

module.exports = mongoose.model('loginModel', loginSchema, 'Usuarios')
