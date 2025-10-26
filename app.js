
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    if (loginBtn && loginModal && closeModal) {
        loginBtn.onclick = function() {
            loginModal.style.display = 'block';
        };
        closeModal.onclick = function() {
            loginModal.style.display = 'none';
        };
        window.onclick = function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        };
    }
});

const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const login = document.getElementById("login").value;
    const contrasena = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cuenta: login, 
                contrasena: contrasena
            })
        });

        // Intentamos parsear el JSON
        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            console.warn("Respuesta no JSON del servidor", parseErr);
            data = {}
        }

        // Revisar respuesta
        if (res.ok) {
            const cuenta = data.usuario?.cuenta;
            if (cuenta) {
               
                Swal.fire({
                    icon: 'success',
                    title: '¡Acceso permitido!',
                    text: `Bienvenido: ${cuenta}`,
                    confirmButtonText: 'Continuar'
                });
                console.log("Usuario recibido:", data.usuario);
                const userNameSpan = document.getElementById('userName');
                if (userNameSpan) userNameSpan.textContent = cuenta;
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.style.display = 'none';
            } else {
                console.warn('200 OK sin usuario:', data);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error inesperado',
                    text: 'Respuesta incompleta del servidor',
                    confirmButtonText: 'Entendido'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
                confirmButtonText: 'Reintentar'
            });
            const loginInput = document.getElementById("login");
            const passInput = document.getElementById("password");
            if (loginInput) loginInput.value = "";
            if (passInput) passInput.value = "";
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            confirmButtonText: 'Reintentar'
        });
    }
});