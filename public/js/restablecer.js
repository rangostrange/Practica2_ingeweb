const form = document.getElementById("recuperacion");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Limpiar mensajes previos
    document.getElementById("error-correo").textContent = "";
    document.getElementById("error-Respuesta").textContent = "";
    document.getElementById("error-password").textContent = "";
    document.getElementById("error-ConfirmPassword").textContent = "";

    const correo    = document.getElementById("correo").value.trim();
    const respuesta = document.getElementById("respuesta").value;
    const Password  = document.getElementById("Password").value;
    const confirmar = document.getElementById("ConfirmPassword").value;

    let valido = true;

    if (!correo) {
        document.getElementById("error-correo").textContent = "El correo es obligatorio";
        valido = false;
    }

    if (!respuesta) {
        document.getElementById("error-Respuesta").textContent = "La respuesta es obligatoria";
        valido = false;
    }

    if (Password.length < 6) {
        document.getElementById("error-password").textContent = "Mínimo 6 caracteres";
        valido = false;
    }

    if (Password !== confirmar) {
        document.getElementById("error-ConfirmPassword").textContent = "Las contraseñas no coinciden";
        valido = false;
    }

    if (!valido) return;

    try {
        const response = await fetch("/recuperar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, respuesta, Password })
        });

        const data = await response.json();

        if (data.ok) {
            const msg = document.getElementById("msg-exito");
            msg.textContent = "¡Contraseña actualizada! Redirigiendo...";
            msg.style.display = "block";
            setTimeout(() => window.location.href = "/html/Login.html", 2000);
        } else {
            alert(data.mensaje);
        }
    } catch (err) {
        alert("Error al conectar con el servidor");
    }
});