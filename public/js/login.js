document.addEventListener("DOMContentLoaded", () => {

    console.log("login.js cargado");

    const form = document.getElementById("Inciosession");

    if (!form) {
        console.error("No se encontró el formulario");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); //  evita que se vaya a la URL

        try {
            const datos = Object.fromEntries(new FormData(form));

            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (data.ok) {
                //  guardar estado de autenticación
                localStorage.setItem("auth", "true");
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                console.log("Login exitoso");

                //  redirigir al dashboard
                window.location.href = "/dashboard";

            } else {
                alert(data.mensaje);
            }

        } catch (error) {
            console.error("Error en login:", error);
            alert("Error al conectar con el servidor");
        }
    });

});