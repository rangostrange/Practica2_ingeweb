/**
 * Lógica de negocio de la aplicación.
 * Responsabilidades:
 *  1. Validar datos recibidos
 *  2. Aplicar reglas de negocio
 *  3. Coordinar operaciones con el modelo
 *  4. Retornar siempre { success, errors, data }
 */

import bcrypt from 'bcrypt';
import {
    writeUser,
    findUserByEmail,
    existsUser,
    updatePassword
} from '../models/models.js';

const SALT_ROUNDS = 12;

/* ===== REGISTRO ===== */
export const processForm = async (datos) => {
    const { nombre, Password, PreguntaRecuperacion, RespuestaRecuperacion, correo } = datos;
    const errores = {};

    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
        errores.nombre = 'El nombre solo debe contener letras';
    }

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = 'Correo inválido';
    }

    if (!Password || Password.length < 6) {
        errores.Password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!RespuestaRecuperacion || RespuestaRecuperacion.length < 2) {
        errores.RespuestaRecuperacion = 'Respuesta de seguridad inválida';
    }

    if (Object.keys(errores).length > 0) {
        return { success: false, errors: errores, data: null };
    }

    try {
        if (await existsUser(correo)) {
            return {
                success: false,
                errors: { correo: 'El correo ya está registrado' },
                data: null
            };
        }

        const passwordHash   = await bcrypt.hash(Password, SALT_ROUNDS);
        const respuestaHash  = await bcrypt.hash(RespuestaRecuperacion, SALT_ROUNDS);

        const nuevoUsuario = {
            nombre,
            correo,
            Password: passwordHash,
            PreguntaRecuperacion,
            RespuestaRecuperacion: respuestaHash,
            fecha: new Date()
        };

        await writeUser(nuevoUsuario);

        return { success: true, errors: null, data: { nombre, correo } };

    } catch (err) {
        console.error('Error en processForm:', err.message);
        return {
            success: false,
            errors: { general: 'No se pudo guardar la información' },
            data: null
        };
    }
};

/* ===== LOGIN ===== */
export const validateUser = async (correo, Password) => {
    try {
        const user = await findUserByEmail(correo);

        if (!user) {
            return {
                success: false,
                errors: { correo: 'Usuario no encontrado' },
                data: null
            };
        }

        const match = await bcrypt.compare(Password, user.Password);

        if (!match) {
            return {
                success: false,
                errors: { Password: 'Contraseña incorrecta' },
                data: null
            };
        }

        return {
            success: true,
            errors: null,
            data: { nombre: user.nombre, correo: user.correo }
        };

    } catch (err) {
        console.error('Error en validateUser:', err.message);
        return {
            success: false,
            errors: { general: 'Error del servidor' },
            data: null
        };
    }
};

/* ===== RECUPERAR CONTRASEÑA ===== */
export const recoverPassword = async (correo, respuesta, nuevaPassword) => {
    try {
        if (!nuevaPassword || nuevaPassword.length < 6) {
            return {
                success: false,
                errors: { Password: 'La nueva contraseña debe tener al menos 6 caracteres' },
                data: null
            };
        }

        const user = await findUserByEmail(correo);

        if (!user) {
            return {
                success: false,
                errors: { correo: 'Usuario no encontrado' },
                data: null
            };
        }

        const match = await bcrypt.compare(respuesta, user.RespuestaRecuperacion);

        if (!match) {
            return {
                success: false,
                errors: { respuesta: 'Respuesta incorrecta' },
                data: null
            };
        }

        const nuevaHash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);
        await updatePassword(correo, nuevaHash);

        return { success: true, errors: null, data: null };

    } catch (err) {
        console.error('Error en recoverPassword:', err.message);
        return {
            success: false,
            errors: { general: 'Error del servidor' },
            data: null
        };
    }
};