/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente.
 */
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import {
    procesarFormulario,
    obtenerUsuarioPorCorreo,
    actualizarPassword
} from "../services/formService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===== LOGIN (VISTA PRINCIPAL) ===== */
export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/Login.html"));
};

/* ===== REGISTRO ===== */
export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await procesarFormulario(req.body);

        res.status(200).json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/* ===== LOGIN ===== */
export const loginUsuario = async (req, res) => {
    try {
        const { correo, Password } = req.body;

        if (!correo || !Password) {
            throw new Error("Datos incompletos");
        }

        const usuario = await obtenerUsuarioPorCorreo(correo);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        const coincide = await bcrypt.compare(Password, usuario.Password);

        if (!coincide) {
            throw new Error("Contraseña incorrecta");
        }

        res.json({
            ok: true,
            mensaje: "Login correcto",
            usuario: {
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

/* ===== RECUPERAR PASSWORD ===== */
export const recuperarPassword = async (req, res) => {
    try {
        const { correo, respuesta, Password } = req.body;

        if (!correo || !respuesta || !Password) {
            throw new Error("Datos incompletos");
        }

        if (Password.length < 6) {
            throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
        }

        await actualizarPassword(correo, respuesta, Password);

        res.json({
            ok: true,
            mensaje: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};