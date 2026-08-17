const express = require('express');
const Relatorio = require('../models/relatoriosModel');

const router = express.Router();


// =====================================================
// LISTAR RELATÓRIOS
// GET /api/relatorios
// =====================================================

router.get('/relatorios', async (req, res) => {

    try {

        const relatorios = await Relatorio.find()
            .sort({ createdAt: -1 });
        res.status(200).json(relatorios);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao buscar relatórios'
        });
    }

});


// =====================================================
// CRIAR RELATÓRIO
// POST /api/relatorios
// =====================================================

router.post('/relatorios', async (req, res) => {

    try {

        const novoRelatorio = new Relatorio({
            titulo: req.body.titulo,
            tipo: req.body.tipo,
            dataInicial: req.body.dataInicial,
            dataFinal: req.body.dataFinal,
            descricao: req.body.descricao
        });

        await novoRelatorio.save();

        res.status(201).json({
            mensagem: 'Relatório criado com sucesso!',
            relatorio: novoRelatorio
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao criar relatório'
        });
    }

});


// =====================================================
// EDITAR RELATÓRIO
// PUT /api/relatorios/:id
// =====================================================

router.put('/relatorios/:id', async (req, res) => {

    try {

        const relatorio = await Relatorio.findByIdAndUpdate(
            req.params.id,
            {
                titulo: req.body.titulo,
                tipo: req.body.tipo,
                dataInicial: req.body.dataInicial,
                dataFinal: req.body.dataFinal,
                descricao: req.body.descricao
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!relatorio) {
            return res.status(404).json({
                erro: 'Relatório não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Relatório atualizado com sucesso!',
            relatorio
        });

    } catch (erro) {

        console.error(erro);
        res.status(500).json({
            erro: 'Erro ao atualizar relatório'
        });
    }

});


// =====================================================
// EXCLUIR RELATÓRIO
// DELETE /api/relatorios/:id
// =====================================================

router.delete('/relatorios/:id', async (req, res) => {

    try {

        const relatorio = await Relatorio.findByIdAndUpdate(
            req.params.id,
            {status: 'excluido'},
            {new: true}
        );

        if (!relatorio) {
            return res.status(404).json({
                erro: 'Relatório não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Relatório excluído com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir relatório'
        });
    }

});


module.exports = router;