const mongoose = require('mongoose');

const vinhoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    // Estes campos são específicos de vinho. Para os demais tipos de produto
    // eles permanecem vazios até que cada produto tenha seu próprio schema.
    
    vinicola: {
        type: String,
        required: function () { return this.categoria === 'vinho'; }
    },
    ano: {
        type: Number,
        required: function () { return this.categoria === 'vinho'; }
    },
    preco: {type: Number, required: true},
    categoria: {
        type: String,
        enum: ['vinho', 'geleia', 'suco', 'queijo'],
        default: 'vinho'
    },
    estoque: {type: Number, required: true},
    imagem: {type: String, required: true},
    status: {type: String, enum: ['ativo', 'excluido'], default: 'ativo'}
}, { timestamps: true });

module.exports = mongoose.model('Vinho', vinhoSchema, 'Produtos');
