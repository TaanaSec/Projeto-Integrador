const login = require('../models/loginModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const auth = require('../middlewares/auth')
dotenv.config()

function escaparHtml(valor = '') {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

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
            expiresIn: "1h"
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
            const nomeSeguro = escaparHtml(nome)
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

                text: `Olá, ${nome}!
                    Seu cadastro na La Tavola foi concluído com sucesso.

                    Agora você pode descobrir produtos selecionados para tornar cada momento à mesa ainda mais especial.

                    O que você encontra por aqui:
                    - Vinhos selecionados
                    - Produtos para harmonizar e compartilhar
                    - Uma experiência simples e segura para suas compras

                    Que bom ter você com a gente!

                    Se você não realizou este cadastro, desconsidere este e-mail.`,

                html: `
                    <div style="margin:0; padding:32px 16px; background-color:#f6f1ed; font-family:Arial, Helvetica, sans-serif; color:#342a2a;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 16px rgba(69, 39, 26, 0.10);">
                        <tr>
                          <td style="padding:30px 36px; background:#5d0000; color:#ffffff; text-align:center;">
                            <div style="margin-bottom:8px; font-size:12px; font-weight:bold; letter-spacing:3px;">EMPÓRIO</div>
                            <div style="font-family:Georgia, 'Times New Roman', serif; font-size:30px; line-height:1.1;">La Tavola</div>
                            <div style="margin-top:10px; font-size:13px; color:#f3dada;">Sabores para compartilhar bons momentos</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:36px;">
                            <h1 style="margin:0 0 16px; color:#5d0000; font-family:Georgia, 'Times New Roman', serif; font-size:28px; font-weight:normal; line-height:1.25;">Olá, ${nomeSeguro}!</h1>
                            <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Seu cadastro foi concluído com sucesso. É uma alegria ter você na <strong>La Tavola</strong>.</p>
                            <p style="margin:0 0 24px; font-size:16px; line-height:1.6;">A partir de agora, você pode descobrir produtos selecionados para tornar cada momento à mesa ainda mais especial.</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px; background:#fbf7f4; border:1px solid #eadfd8; border-radius:10px;">
                              <tr><td style="padding:20px 22px 10px; color:#5d0000; font-size:16px; font-weight:bold;">O que você encontra por aqui</td></tr>
                              <tr><td style="padding:0 22px 8px; font-size:14px; line-height:1.5;">🍷 Vinhos selecionados para diferentes ocasiões</td></tr>
                              <tr><td style="padding:0 22px 8px; font-size:14px; line-height:1.5;">🧀 Produtos ideais para harmonizar e compartilhar</td></tr>
                              <tr><td style="padding:0 22px 20px; font-size:14px; line-height:1.5;">✓ Uma experiência simples e segura para suas compras</td></tr>
                            </table>

                            <p style="margin:0; padding:16px 18px; border-left:4px solid #b98b5f; background:#fffaf5; color:#5b5151; font-size:14px; line-height:1.55;">Esperamos que sua próxima descoberta seja o acompanhamento perfeito para um ótimo momento.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:22px 36px; border-top:1px solid #eadfd8; color:#766b65; font-size:12px; line-height:1.5; text-align:center;">
                            <strong style="color:#5d0000;">La Tavola</strong><br>
                            Obrigado por escolher a nossa comunidade.<br><br>
                            Se você não realizou este cadastro, desconsidere este e-mail.
                          </td>
                        </tr>
                      </table>
                    </div>`
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
            expiresIn: "10s" // 240s
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

exports.envioEmail = async (req, res) => {
    const usuario = await login.findById(
        req.usuarioId
    )
    const { tituloEmail, mensagemEmail} = req.body
    const textPadrao = `Email do cliente ${usuario.nome} - reclamação`

    if (!tituloEmail || !mensagemEmail) {
        return res.status(400).json({ msg: "Por favor, preencha todos os campos para encaminhar o e-mail." })
    }

    try {
        const transportador = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        })

        const info = await transportador.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            replyTo: usuario.email,
            subject: tituloEmail,
            text: textPadrao,
            html: `
                <p><strong>Cliente: </strong>${usuario.nome}</p>
                <p><strong>Email: </strong>${usuario.email}</p>

                <hr>

                <p><strong>Mensagem: </strong>${mensagemEmail}</p>
            `
        })
        res.status(200).json({ msg: "E-mail enviado com sucesso! ", info })
    } catch (erro) {
        res.status(500).json({ msg: "Erro ao enviar e-mail ", erro: erro.message})
    }
}
