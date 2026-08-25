const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: 'Token não fornecido.'
        });
    }

    const partes = authHeader.split(' ');

    if (
        partes.length !== 2 ||
        partes[0] !== 'Bearer'
    ) {
        return res.status(401).json({
            erro: 'Formato de token inválido.'
        });
    }

    const token = partes[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.SECRET
        );

        if (
            decoded.role !== 'admin' ||
            decoded.nivel !== 'superadmin'
        ) {
            return res.status(403).json({
                erro: 'Acesso permitido somente ao administrador principal.'
            });
        }

        req.adminId = decoded.id;

        next();

    } catch (erro) {

        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
};