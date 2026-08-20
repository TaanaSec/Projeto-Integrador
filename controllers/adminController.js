const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

exports.login = async (req, res) => {

    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Informe email e senha.'
            });
        }

        const admin = await Admin
            .findOne({ email })
            .select('+senha');

        if (!admin) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            admin.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: 'admin',
                nivel: admin.nivel
            },
            process.env.SECRET,
            {
                expiresIn: '8h'
            }
        );

        res.status(200).json({
            mensagem: 'Login administrativo realizado com sucesso!',
            token,
            administrador: {
                id: admin._id,
                nome: admin.nome,
                email: admin.email
            }
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao realizar login administrativo.'
        });
    }
};