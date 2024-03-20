const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sign_in_btn2 = document.querySelector("#sign-in-btn2");
const sign_up_btn2 = document.querySelector("#sign-up-btn2");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});
sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2");
});
sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2");
});

//Enviar datos de inicio de sesion
let formularioInicioSesion = document.getElementById('form_log');
formularioInicioSesion.addEventListener('submit', function (e) {
    e.preventDefault();
    let correo = document.getElementById('correo').value;
    let contrasena = document.getElementById('contra').value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    })
        .then(res => res.text())
        .then(data => {
            if (data === 'error') {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Usuario o contraseña incorrectos",
                    confirmButtonColor: "#48a04b"
                });
            } else {
                window.location.href = '../page_admin.html';
            }
        });
});