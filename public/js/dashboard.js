// PROTECCIÓN — redirige si no hay sesión activa
const auth = localStorage.getItem("auth");
if (auth !== "true") {
    window.location.href = "/html/Login.html";
}

// MOSTRAR NOMBRE DE USUARIO
const usuario = JSON.parse(localStorage.getItem("usuario"));
if (usuario) {
    document.getElementById("bienvenida").textContent =
        "¡Hola, " + usuario.nombre + "!";
}

// LOGOUT
function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("usuario");
    window.location.href = "/html/Login.html";
}