const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({

    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    senha: {type: String, required: true, select: false},
    nivel: {type: String, enum: ['admin', 'superadmin'], default: 'admin'}
}, 

{
    timestamps: true
}

)

module.exports = mongoose.model('adminModel', adminSchema, 'usuarioAdmin')