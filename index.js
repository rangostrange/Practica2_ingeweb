/* 
   Archivo principal que inicia el servidor.
   Responsabilidades:
     1. Configurar Express
     2. Leer variables de entorno
     3. Registrar middlewares
     4. Registrar rutas
     5. Servir archivos estáticos (assets)


  Se requiere configurar el proyecto nodeJS
  
  1. Iniciarlizar proyecto
     npm init -y ------ asigna valores por defecto en 
                 ------ la configuración de package.json

   2. Instalar dependencias para el proyecto: en este caso
      Express para el servidor HTTP para procesar peticiones
      a través de envíos POST y GET.

      npm install express

      npm install --save-dev nodemon

*/

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
/*liga el servidor con el contenido estatico*/ 
/*import dotenv from "dotenv"; // npm install dotenv*/

import formRoutes from "./routes/formRoutes.js";

// asigna puerto para atender peticiones
/**
 * | Rango       | Tipo        | Uso recomendado                                 |
| ----------- | ----------- | ----------------------------------------------- |
| 0-1023      | Well-known  | ❌ Reservados (HTTP=80, HTTPS=443, FTP=21, etc.) |
| 1024-49151  | Registrados | ✅ Desarrollo (3000, 4000, 5000, 8080)           |
| 49152-65535 | Dinámicos   | ✅ Temporales                                    |
 */
const PORT = 5000;

// instancia el modulo de express para configurar el servidor
const app = express();


// habilita la conversión de objetos JSON a objetos JS.
app.use(express.json());
// habilita el procesamiento de solicitudes POST/PUT
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// asocia contenido estático HTML, CSS del lado del cliente
app.use("/", express.static(path.join(__dirname, "public")));

// Rutas
/// / form http:localhost:puerto/form/
app.use("/", formRoutes);

// Se asocia el puerto e inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
/**/ 