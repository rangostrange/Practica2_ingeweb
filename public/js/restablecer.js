function setError(input, error, mensaje) {
    error.textContent = mensaje;
    input.classList.add('invalido');
    input.classList.remove('valido');
}

function setValido(input, error) {
    error.textContent = '';
    input.classList.add('valido');
    input.classList.remove('invalido');
}

const form = document.getElementById('recuperacion');

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById('error-' + id);

    if (!input || !error) return true;

    if (!input.value.trim()) {
        setError(input, error, 'Campo obligatorio');
        return false;
    }

    if (id === 'Password' && input.value.length < 6) {
        setError(input, error, 'Mínimo 6 caracteres');
        return false;
    }

    if (id === 'ConfirmPassword') {
        const pass = document.getElementById('Password').value;
        if (input.value !== pass) {
            setError(input, error, 'No coinciden');
            return false;
        }
    }

    setValido(input, error);
    return true;
}

['correo', 'respuesta', 'Password', 'ConfirmPassword'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => validarCampo(id));
    input.addEventListener('input', () => validarCampo(id));
});

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const campos = ['correo', 'respuesta', 'Password', 'ConfirmPassword'];
    let valido = true;

    campos.forEach(id => {
        if (!validarCampo(id)) valido = false;
    });

    if (!valido) return;

    try {
        const response = await fetch('/recuperacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: document.getElementById('correo').value.trim(),
                respuesta: document.getElementById('respuesta').value,
                Password: document.getElementById('Password').value
            })
        });

        const data = await response.json();

        if (data.success) {
            showModal("✅ Contraseña actualizada correctamente");

            setTimeout(() => {
                window.location.href = "/html/Login.html";
            }, 1500);

        } else {
            showModal("❌ " + Object.values(data.errors).join(", "));
        }

    } catch (err) {
        showModal("❌ Error al conectar con el servidor");
    }
});