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

function validarCampo(input) {
    const error = document.getElementById('error-' + input.id);
    if (!input || !error) return true;

    if (input.validity.valueMissing) {
        setError(input, error, 'Este campo es obligatorio');
        return false;
    }

    if (input.type === 'email' && input.validity.typeMismatch) {
        setError(input, error, 'Correo electrónico inválido');
        return false;
    }

    if (input.id === 'Password' && input.value.length < 6) {
        setError(input, error, 'Mínimo 6 caracteres');
        return false;
    }

    setValido(input, error);
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Inciosession');

    ['correo', 'Password'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('blur', () => validarCampo(input));
        input.addEventListener('input', debounce(() => validarCampo(input), 300));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input');
        let valido = true;
        inputs.forEach(input => { if (!validarCampo(input)) valido = false; });
        if (!valido) return;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo:   document.getElementById('correo').value,
                    Password: document.getElementById('Password').value
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('auth', 'true');
                localStorage.setItem('usuario', JSON.stringify(data.data));
                window.location.href = '/dashboard';
            } else {
                const errores = data.errors || {};
                Object.keys(errores).forEach(campo => {
                    const input = document.getElementById(campo);
                    const error = document.getElementById('error-' + campo);
                    if (input && error) setError(input, error, errores[campo]);
                });
            }

        } catch (err) {
            console.error('Error en login:', err);
            alert('Error al conectar con el servidor');
        }
    });
});