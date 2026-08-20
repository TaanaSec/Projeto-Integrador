const mongoose = require('mongoose');

const vinhoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    vinicola: {type: String, required: true},
    ano: {type: Number, required: true},
    preco: {type: Number, required: true},
    categoria: {type: String, default: 'Vinho'},
    estoque: {type: Number, required: true},
    imagem: {type: String, required: true}
});

module.exports = mongoose.model('Vinho', vinhoSchema, 'Produtos');