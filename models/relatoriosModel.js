const mongoose = require('mongoose')

const relatorioSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    tipo: {type: String, required: true},
    dataInicial: {type: Date, required: true},
    dataFinal: {type: Date, required: true},
    descricao: {type: String, required: true},
    status: {type: String, enum: ['ativo', 'excluido'], default: 'ativo'}
},
{
    timestamps: true //O sistema define a data e a hora exatas quando o dado é salvo pela primeira vez
}
)

const Relatorio = mongoose.model('Relatorio', relatorioSchema, 'Relatorios')

module.exports = Relatorio