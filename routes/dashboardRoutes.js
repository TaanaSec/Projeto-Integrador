const express = require('express')
const mongoose = require('mongoose')

//Rota de consulta de usuarios--------------------------------------------------------
const router = express.Router()


router.get('/usuarios/quantidade', async (req, res) => {

    try {
        
        const quantidade = await mongoose.connection.db
            .collection('Usuarios')
            .countDocuments()

        res.status(200).json({
            quantidade: quantidade
        })
    
    } catch (erro) {
        
        console.error(erro)

        res.status(500).json({
            erro: 'Erro ao consultar quantidade de usuários'
        })
    }
})

module.exports = router


//Rota de consulta de Produtos--------------------------------------------------------

router.get('/produtos/quantidade', async (req, res) => {

    try {

        const quantidade = await mongoose.connection.db
            .collection('Produtos')
            .countDocuments()

        res.status(200).json({
            quantidade: quantidade
        })
    
    } catch (erro) {

        console.error(erro)

        res.status(500).json({
            erro: 'Erro ao consultar quantidade de produtos'
        })
    } 
})

// //Rota de criação de relatorios--------------------------------------------------------
// const Relatorio = require('../models/relatoriosModel')

// router.post('/relatorios', async (req, res) => {

//     try {

//         const novoRelatorio = new Relatorio({
//             titulo: req.body.titulo,
//             tipo: req.body.tipo,
//             dataInicial: req.body.dataInicial,
//             dataFinal: req.body.dataFinal,
//             descricao: req.body.descricao
//         })

//         await novoRelatorio.save()

//         res.status(201).json({
//             mensagem: 'Relatório criado com sucesso!',
//             relatorio: novoRelatorio
//         })

//     } catch (erro) {

//         console.error(erro)

//         res.status(500).json({
//             erro: 'Erro ao criar relatório'
//         })
//     }
// })