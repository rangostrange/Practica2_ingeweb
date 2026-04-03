/**
 * Define la estructura de datos y las operaciones
 * de lectura/escritura sobre el archivo JSON.
 *  1. Leer usuarios
 *  2. Escribir usuario
 *  3. Buscar por correo
 *  4. Verificar existencia
 *  5. Actualizar contraseña
 */

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, '../data/usuarios.json');

export const readUsers = async () => {
    try {
        const data = await readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

export const writeUser = async (newUser) => {
    try {
        const users = await readUsers();
        users.push(newUser);
        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
        return users;
    } catch (error) {
        console.error('Error al escribir usuario:', error);
        return null;
    }
};

export const findUserByEmail = async (correo) => {
    const users = await readUsers();
    return users.find(
        ({ correo: c }) =>
            c && correo && c.toLowerCase() === correo.toLowerCase()
    ) || null;
};

export const existsUser = async (correo) =>
    !!(await findUserByEmail(correo));

export const updatePassword = async (correo, newPasswordHash) => {
    try {
        const users = await readUsers();
        const index = users.findIndex(
            u => u.correo.toLowerCase() === correo.toLowerCase()
        );
        if (index === -1) return false;
        users[index].Password = newPasswordHash;
        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        return false;
    }
};