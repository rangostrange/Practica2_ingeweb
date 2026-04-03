/* helpers */
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

function debounce(func, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

const form = document.getElementById('recuperacion');

['correo', 'respuesta', 'Password', 'ConfirmPassword'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', debounce(() => validarCampo(id), 300));
    input.addEventListener('input', debounce(() => validarCampo(id), 300));
});

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById('error-' + id);
    if (!input || !error) return true;

    if (input.validity.valueMissing || !input.value.trim()) {
        setError(input, error, 'Este campo es obligatorio');
        return false;
    }

    if (id === 'Password' && input.value.length < 6) {
        setError(input, error, 'Mínimo 6 caracteres');
        return false;
    }

    if (id === 'ConfirmPassword') {
        const pass = document.getElementById('Password').value;
        if (input.value !== pass) {
            setError(input, error, 'Las contraseñas no coinciden');
            return false;
        }
    }

    setValido(input, error);
    return true;
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const campos = ['correo', 'respuesta', 'Password', 'ConfirmPassword'];
    let valido = true;
    campos.forEach(id => { if (!validarCampo(id)) valido = false; });
    if (!valido) return;

    try {
        const response = await fetch('/recuperacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo:   document.getElementById('correo').value.trim(),
                respuesta: document.getElementById('respuesta').value,
                Password:  document.getElementById('Password').value
            })
        });

        const data = await response.json();

        if (data.success) {
            const msg = document.getElementById('msg-exito');
            msg.textContent = '¡Contraseña actualizada! Redirigiendo...';
            msg.style.display = 'block';
            setTimeout(() => window.location.href = '/html/Login.html', 2000);
        } else {
            const errores = data.errors || {};
            Object.keys(errores).forEach(campo => {
                const input = document.getElementById(campo);
                const error = document.getElementById('error-' + campo);
                if (input && error) setError(input, error, errores[campo]);
                else alert(errores[campo]);
            });
        }
    } catch (err) {
        alert('Error al conectar con el servidor');
    }
});