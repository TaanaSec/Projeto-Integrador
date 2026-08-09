const mongoose = require('mongoose')

const relatorioSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    dataInicial: {type: String, required: true},
    dataFinal: {type: String, required: true},
    descricao: {type: String, required: true}
})

const Relatorio = mongoose.model('Relatorio', relatorioSchema)

module.exports = Relatorio