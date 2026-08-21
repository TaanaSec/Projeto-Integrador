const express = require('express');
const multer = require('multer');
const path = require('path');
const Vinho = require('../models/vinhoModel');

const router = express.Router();
const categoriasPermitidas = ['vinho', 'geleia', 'suco', 'queijo'];

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'vinhos'));
    },
    filename(req, file, cb) {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeBase = path.basename(file.originalname, extensao)
            .replace(/[^a-zA-Z0-9_-]/g, '-');
        cb(null, `${Date.now()}-${nomeBase}${extensao}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Envie apenas arquivos de imagem.'));
        }
        cb(null, true);
    }
});

router.get('/produtos', async (req, res) => {
    try {
        const produtos = await Vinho.find().sort({ createdAt: -1 });
        res.status(200).json(produtos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
});

router.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, categoria, vinicola, ano, preco, estoque } = req.body;

        if (!req.file) {
            return res.status(400).json({ erro: 'A imagem do produto é obrigatória.' });
        }

        if (!categoriasPermitidas.includes(categoria)) {
            return res.status(400).json({ erro: 'Categoria de produto inválida.' });
        }

        if (categoria === 'vinho' && (!vinicola || !ano)) {
            return res.status(400).json({ erro: 'Vinícola e ano são obrigatórios para vinho.' });
        }

        const produto = await Vinho.create({
            nome: nome?.trim(),
            categoria,
            vinicola: vinicola?.trim(),
            ano: ano ? Number(ano) : undefined,
            preco: Number(preco),
            estoque: Number(estoque),
            imagem: `/uploads/vinhos/${req.file.filename}`
        });

        res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', produto });
    } catch (erro) {
        console.error(erro);
        res.status(400).json({ erro: 'Não foi possível cadastrar o produto.' });
    }
});

router.delete('/produtos/:id', async (req, res) => {
    try {
        const produto = await Vinho.findByIdAndUpdate(
            req.params.id,
            { status: 'excluido' },
            { new: true }
        );

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
    } catch (erro) {
        console.error(erro);
        res.status(400).json({ erro: 'Não foi possível excluir o produto.' });
    }
});

router.use((erro, req, res, next) => {
    if (erro instanceof multer.MulterError || erro.message === 'Envie apenas arquivos de imagem.') {
        return res.status(400).json({ erro: erro.message });
    }
    next(erro);
});

module.exports = router;
