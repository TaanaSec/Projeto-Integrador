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


// Catálogo público: retorna somente os vinhos que o cliente pode comprar.
router.get('/produtos/vinhos', async (req, res) => {
    try {
        const paginaInformada = Number.parseInt(req.query.pagina, 10);
        const pagina = Number.isInteger(paginaInformada) && paginaInformada > 0 ? paginaInformada : 1;
        const limite = 16;
        const busca = String(req.query.busca || '').trim();

        const filtro = {
            categoria: 'vinho',
            status: { $ne: 'excluido' },
            estoque: { $gt: 0 }
        };

        if (busca) {
            const buscaSegura = busca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filtro.nome = { $regex: buscaSegura, $options: 'i' };
        }

        const total = await Vinho.countDocuments(filtro);
        const totalPaginas = Math.max(1, Math.ceil(total / limite));
        const paginaAtual = Math.min(pagina, totalPaginas);
        const produtos = await Vinho.find(filtro)
            .sort({ createdAt: -1 })
            .skip((paginaAtual - 1) * limite)
            .limit(limite)
            .lean();

        res.status(200).json({ produtos, total, pagina: paginaAtual, totalPaginas });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar os vinhos disponíveis.' });
    }
});

// Detalhe público de um vinho disponível no catálogo.
router.get('/produtos/:id', async (req, res) => {
    try {
        const produto = await Vinho.findOne({
            _id: req.params.id,
            categoria: 'vinho',
            status: { $ne: 'excluido' },
            estoque: { $gt: 0 }
        }).lean();

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado ou indisponível.' });
        }

        res.status(200).json(produto);
    } catch (erro) {
        res.status(400).json({ erro: 'Identificador de produto inválido.' });
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
