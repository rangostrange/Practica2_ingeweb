/**
 * Encargo de la lógica de negocio
 * Responsabilidades:
 *  1. Procesar datos del formulario
 *  2. Guardar información
 *  3. Aplicar reglas de negocio
 *  4. Transformar datos
 */
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
 
    const datosProcesados = {
        nombre,
        correo,
        Password,
        PreguntaRecuperacion,
        RespuestaRecuperacion,
        fecha: new Date()
    };
 
    /* aquí podrías guardar en DB */
 
    console.log("Procesado:", datosProcesados);
    return datosProcesados;
};