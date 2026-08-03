const login = require('../models/loginModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
dotenv.config()

// Cadastrar (nome, email, senha)
exports.cadastro = async (req, res) => {
    const { nome, email, senha } = req.body
    const usuarioExiste = await login.findOne({ email })

    if (usuarioExiste) {
        return res.status(409).json({ erro: "Este e-mail já está cadastrado." })
    }

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" })
    }

    try {
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        const novoLogin = new login({ nome, email, senha: senhaHash })
        await novoLogin.save()

        // TOKEN
        const token = jwt.sign({ id: novoLogin._id }, process.env.SECRET, {
            expiresIn: "60s"
        })

        res.status(201).json({
            token,
            usuario: {
                id: novoLogin._id,
                nome: novoLogin.nome,
                email: novoLogin.email
            }
        })

        // Envio de e-mail de boas-vindas
        try {
            const transportador = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            })

            await transportador.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject: `🎉 ${nome}, bem-vindo ao LaTavola!`,
                text: `Olá ${nome}, obrigado por se registrar no LaTavola!`,
                html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #d32f2f;">Olá, ${nome}!</h2>
                            <p style="font-size: 16px; line-size: 1.5;">Obrigado por se registrar no <strong>LaTavola</strong>.</p>
                            <p style="font-size: 16px;">Seja muito bem-vindo à nossa comunidade!</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <small style="color: #777;">Se você não realizou este cadastro, desconsidere este e-mail.</small>
                        </div>
                    `
            })

        } catch (error) {
            console.error("Erro ao enviar e-mail de boas-vindas: ", error.message)
        }

    } catch (error) {
        res.status(500).json({ erro: "Erro ao realizar cadastro." })
    }

}

exports.login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios!" })
    }

    try {
        const usuario = await login
            .findOne({ email })
            .select('+senha')

        if (!usuario) {
            return res.status(401).json({ erro: "Credenciais inválidas!" })
        }

        if (!await bcrypt.compare(senha, usuario.senha)) {
            return res.status(401).json({ erro: "Credenciais inválidas!" })
        }


        // TOKEN
        const token = jwt.sign({ id: usuario._id }, process.env.SECRET, {
            expiresIn: "60s"
        })

        res.status(200).json({
            msg: "Autenticação realizada com sucesso!",
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        })

    } catch (error) {
        res.status(500).json({ erro: "Erro ao realizar login" })
    }
}

// Perfil do usuário
exports.perfil = async (req, res) => {

    const usuario = await login.findById(
        req.usuarioId
    )

    res.status(200).json(usuario)
}

// Página de contato do usuário via e-mail
exports.contato = async (req, res) => {

    const usuario = await login.findById(
        req.usuarioId
    )

    res.status(200).json(usuario)
}
