const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não fornecido."
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.SECRET
        )

        req.usuarioId = decoded.id

        next()
    } catch (error) {
        res.status(401).json({
            erro: "Token inválido."
        })
    }
}
