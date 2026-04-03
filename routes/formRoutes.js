/**
 * Rutas de la aplicación.
 * Asocia cada URL con su controlador correspondiente.
 */

import express from 'express';
import {
    showLogin,
    showRegister,
    showRecover,
    showDashboard,
    registerUser,
    loginUser,
    recoverUser
} from '../controllers/formControllers.js';

const router = express.Router();

/* ===== VISTAS ===== */
router.get('/',            showLogin);
router.get('/registro',    showRegister);
router.get('/recuperacion', showRecover);
router.get('/dashboard',   showDashboard);

/* ===== ACCIONES ===== */
router.post('/registro',    registerUser);
router.post('/login',       loginUser);
router.post('/recuperacion', recoverUser);

export default router;