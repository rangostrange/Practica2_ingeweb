const form = document.getElementById("Registro");

const campos = [
    "nombre",
    "correo",
    "PreguntaRecuperacion",
    "RespuestaRecuperacion",
    "Password",
    "ConPassword"
];

function validarCampo(id){
    const input = document.getElementById(id);
    const error = document.getElementById("error-"+id);

    const pass = document.getElementById("Password");

    if(!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido","invalido");

    if(input.required && input.validity.valueMissing){
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    if(input.validity.patternMismatch){
        const mensajes = {
            nombre: "El nombre solo debe contener letras (3-50 caracteres)"
        };

        error.textContent = mensajes[id] || "Formato inválido";
        input.classList.add("invalido");
        return false;
    }

    if(input.validity.typeMismatch){
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }

    if(id === "Password" && input.value.length < 6){
        error.textContent = "La contraseña debe tener al menos 6 caracteres";
        input.classList.add("invalido");
        return false;
    }

    if(id === "ConPassword"){
        if(input.value !== pass.value){
            error.textContent = "Las contraseñas no coinciden";
            input.classList.add("invalido");
            return false;
        }
    }

    input.classList.add("valido");
    return true;
}

/* eventos */
campos.forEach(id => {
    const input = document.getElementById(id);
    if(!input) return;

    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => validarCampo(id));
});

/* submit */
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    let valido = true;

    campos.forEach(id => {
        if (!validarCampo(id)) valido = false;
    });

    if (!valido) return;

    const datos = Object.fromEntries(new FormData(form));

    try {
        const response = await fetch("/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (data.success) {
            showModal("✅ Usuario registrado correctamente");
            form.reset();
        } else {
            showModal("❌ " + Object.values(data.errors).join(", "));
        }

    } catch (error) {
        showModal("❌ Error al conectar con el servidor");
    }
});