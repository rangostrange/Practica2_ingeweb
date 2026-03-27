/**
 * Punto de entrada del servidor.
 * Responsabilidades:
 *   1. Configurar Express
 *   2. Registrar middlewares
 *   3. Registrar rutas
 *   4. Servir archivos estáticos
 *   5. Manejar errores 404 y 500
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import formRoutes from './routes/formRoutes.js';
import { get404 } from './controllers/errorController.js';

const PORT = 5000;
const app  = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ===== MIDDLEWARES ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* ===== RUTAS ===== */
app.use('/', formRoutes);

/* ===== MANEJO DE ERRORES ===== */
app.use(get404);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        errors: { general: err.message || 'Algo salió mal' },
        data: null
    });
});

/* ===== SERVIDOR ===== */
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});