const bcrypt = require('bcrypt');

const Admin = require('../models/adminModel');


// =====================================================
// LISTAR ADMINISTRADORES
// =====================================================

exports.listar = async (req, res) => {

    try {

        const administradores = await Admin
            .find({})
            .select('_id nome email nivel createdAt updatedAt')
            .sort({ createdAt: -1 });

        res.status(200).json(administradores);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar administradores.'
        });
    }
};


// =====================================================
// CRIAR ADMINISTRADOR
// =====================================================

exports.criar = async (req, res) => {

    try {

        const {
            nome,
            email,
            senha
        } = req.body;


        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro: 'Todos os campos são obrigatórios.'
            });
        }


        const emailNormalizado =
            email.trim().toLowerCase();


        const administradorExiste =
            await Admin.findOne({
                email: emailNormalizado
            });


        if (administradorExiste) {

            return res.status(409).json({
                erro: 'Este e-mail já está cadastrado.'
            });
        }


        const senhaHash =
            await bcrypt.hash(senha, 12);


        const novoAdmin = new Admin({

            nome: nome.trim(),

            email: emailNormalizado,

            senha: senhaHash,

            // Todo administrador criado pela tela
            // será admin comum.
            nivel: 'admin'
        });


        await novoAdmin.save();


        res.status(201).json({

            mensagem:
                'Administrador criado com sucesso!',

            administrador: {
                id: novoAdmin._id,
                nome: novoAdmin.nome,
                email: novoAdmin.email,
                nivel: novoAdmin.nivel
            }
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao criar administrador.'
        });
    }
};


// =====================================================
// EDITAR ADMINISTRADOR
// =====================================================

exports.editar = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nome,
            email,
            senha
        } = req.body;


        const admin = await Admin.findById(id);

        if (!admin) {

            return res.status(404).json({
                erro: 'Administrador não encontrado.'
            });
        }


        // Não permitimos editar o superadmin
        // por essa tela.
        if (admin.nivel === 'superadmin') {

            return res.status(403).json({
                erro:
                    'O administrador principal não pode ser editado por esta área.'
            });
        }


        if (!nome || !email) {

            return res.status(400).json({
                erro: 'Nome e e-mail são obrigatórios.'
            });
        }


        const emailNormalizado =
            email.trim().toLowerCase();


        const outroAdmin =
            await Admin.findOne({
                email: emailNormalizado,
                _id: { $ne: id }
            });


        if (outroAdmin) {

            return res.status(409).json({
                erro: 'Este e-mail já está cadastrado.'
            });
        }


        admin.nome = nome.trim();

        admin.email = emailNormalizado;


        if (senha && senha.trim() !== '') {

            admin.senha =
                await bcrypt.hash(senha, 12);
        }


        await admin.save();


        res.status(200).json({

            mensagem:
                'Administrador atualizado com sucesso!',

            administrador: {
                id: admin._id,
                nome: admin.nome,
                email: admin.email,
                nivel: admin.nivel
            }
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao editar administrador.'
        });
    }
};


// =====================================================
// EXCLUIR ADMINISTRADOR
// =====================================================

exports.excluir = async (req, res) => {

    try {

        const { id } = req.params;


        const admin =
            await Admin.findById(id);


        if (!admin) {

            return res.status(404).json({
                erro: 'Administrador não encontrado.'
            });
        }


        // Nunca permitimos excluir o superadmin
        if (admin.nivel === 'superadmin') {

            return res.status(403).json({
                erro:
                    'O administrador principal não pode ser excluído.'
            });
        }


        await Admin.findByIdAndDelete(id);


        res.status(200).json({

            mensagem:
                'Administrador excluído com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir administrador.'
        });
    }
};