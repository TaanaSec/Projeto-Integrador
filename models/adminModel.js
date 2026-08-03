const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    senha : { type: String, require: true, select: false }
}, { timestamps: true });

module.exports = mongoose.model('adminModel', adminSchema, 'usuarioAdmin')
