const express = require('express');

const administradoresController =
    require('../controllers/administradoresController');

const superAdminAuth =
    require('../middlewares/superAdminAuth');


const router = express.Router();


// =====================================================
// LISTAR
// GET /api/administradores
// =====================================================

router.get(
    '/administradores',
    superAdminAuth,
    administradoresController.listar
);


// =====================================================
// CRIAR
// POST /api/administradores
// =====================================================

router.post(
    '/administradores',
    superAdminAuth,
    administradoresController.criar
);


// =====================================================
// EDITAR
// PUT /api/administradores/:id
// =====================================================

router.put(
    '/administradores/:id',
    superAdminAuth,
    administradoresController.editar
);


// =====================================================
// EXCLUIR
// DELETE /api/administradores/:id
// =====================================================

router.delete(
    '/administradores/:id',
    superAdminAuth,
    administradoresController.excluir
);


module.exports = router;