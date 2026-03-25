/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const RUTA = "./data/usuarios.json";

/* ===== UTILIDADES ===== */

// leer archivo
const leerUsuarios = async () => {
    try {
        const data = await fs.readFile(RUTA, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// guardar archivo
const guardarUsuarios = async (usuarios) => {
    await fs.writeFile(RUTA, JSON.stringify(usuarios, null, 2));
};

/* ===== REGISTRO ===== */
export const procesarFormulario = async (datos) => {
    const { nombre, Password, PreguntaRecuperacion, RespuestaRecuperacion, correo } = datos;

    const errores = {};

    if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
        errores.nombre = "El nombre solo debe contener letras";
    }

    if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo inválido";
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }

    const usuarios = await leerUsuarios();

    // evitar duplicados
    if (usuarios.find(u => u.correo === correo)) {
        throw new Error("El usuario ya existe");
    }

    // 🔐 HASH
    const passwordHash = await bcrypt.hash(Password, 10);
    const respuestaHash = await bcrypt.hash(RespuestaRecuperacion, 10);

    const nuevoUsuario = {
        nombre,
        correo,
        Password: passwordHash,
        PreguntaRecuperacion,
        RespuestaRecuperacion: respuestaHash,
        fecha: new Date()
    };

    usuarios.push(nuevoUsuario);

    await guardarUsuarios(usuarios);

    return nuevoUsuario;
};

/* ===== LOGIN ===== */
export const obtenerUsuarioPorCorreo = async (correo) => {
    const usuarios = await leerUsuarios();
    return usuarios.find(u => u.correo === correo);
};

/* ===== RECUPERAR PASSWORD ===== */
export const actualizarPassword = async (correo, respuesta, nuevaPassword) => {
    const usuarios = await leerUsuarios();

    const index = usuarios.findIndex(u => u.correo === correo);

    if (index === -1) {
        throw new Error("Usuario no encontrado");
    }

    const usuario = usuarios[index];

    // 🔐 validar respuesta
    const coincide = await bcrypt.compare(respuesta, usuario.RespuestaRecuperacion);

    if (!coincide) {
        throw new Error("Respuesta incorrecta");
    }

    // 🔐 nueva contraseña
    const nuevaHash = await bcrypt.hash(nuevaPassword, 10);

    usuarios[index].Password = nuevaHash;

    await guardarUsuarios(usuarios);

    return true;
};