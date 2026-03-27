/**
 * Encargado de procesar las peticiones HTTP.
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Llamar al servicio correspondiente.
 *   3. Devolver respuesta estandarizada { success, errors, data }.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { processForm, validateUser, recoverPassword } from '../services/formService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ===== VISTAS ===== */
export const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/Login.html'));
};

export const showRegister = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/Registro.html'));
};

export const showRecover = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/Restablecerpass.html'));
};

export const showDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/Principal.html'));
};

/* ===== REGISTRO ===== */
export const registerUser = async (req, res) => {
    try {
        const resultado = await processForm(req.body);

        if (!resultado.success) {
            return res.status(400).json({
                success: false,
                errors: resultado.errors,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            errors: null,
            data: resultado.data
        });

    } catch (err) {
        console.error('Error en registerUser:', err.message);
        return res.status(500).json({
            success: false,
            errors: { general: 'Error interno del servidor' },
            data: null
        });
    }
};

/* ===== LOGIN ===== */
export const loginUser = async (req, res) => {
    try {
        const { correo, Password } = req.body;
        const resultado = await validateUser(correo, Password);

        if (!resultado.success) {
            return res.status(400).json({
                success: false,
                errors: resultado.errors,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            errors: null,
            data: resultado.data
        });

    } catch (err) {
        console.error('Error en loginUser:', err.message);
        return res.status(500).json({
            success: false,
            errors: { general: 'Error interno del servidor' },
            data: null
        });
    }
};

/* ===== RECUPERAR CONTRASEÑA ===== */
export const recoverUser = async (req, res) => {
    try {
        const { correo, respuesta, Password } = req.body;
        const resultado = await recoverPassword(correo, respuesta, Password);

        if (!resultado.success) {
            return res.status(400).json({
                success: false,
                errors: resultado.errors,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            errors: null,
            data: null
        });

    } catch (err) {
        console.error('Error en recoverUser:', err.message);
        return res.status(500).json({
            success: false,
            errors: { general: 'Error interno del servidor' },
            data: null
        });
    }
};