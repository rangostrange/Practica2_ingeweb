/*
   rutas a acciones correspondientes a los
   métodos HTTP POST y GET según correspondan
   para las peticiones al servidor.
 
   En estas rutas se invocan a los controladores
   que son los encargados de procesar las
   peticiones.
*/
 import express from "express";
import {
    mostrarFormulario,
    registrarUsuario,
    loginUsuario,
    recuperarPassword
} from "../controllers/formControllers.js"; 

const router = express.Router();

/* ===== VISTAS ===== */

// Login (principal)
router.get("/", mostrarFormulario);

// Registro
router.get("/registro", (req, res) => {
    res.sendFile("Registro.html", { root: "public/html" });
});

// Recuperación
router.get("/recuperacion", (req, res) => {
    res.sendFile("Restablecerpass.html", { root: "public/html" });
});

//principal
    router.get("/dashboard", (req, res) => {
    res.sendFile("Principal.html", { root: "public/html" });
});
/* ===== ACCIONES ===== */

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.post("/recuperacion", recuperarPassword);

export default router;
 
 