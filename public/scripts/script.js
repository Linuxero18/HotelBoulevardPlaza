document.getElementById("btn_registrarse").addEventListener("click", registrarse);
document.getElementById("btn_iniciar_sesion").addEventListener("click", iniciar);
window.addEventListener("resize", ancho_pagina);

let formulario_login = document.querySelector(".formulario_login");
let formulario_registrarse = document.querySelector(".formulario_registrarse");
let contenedor_login_registrarse = document.querySelector(".contenedor_login-registrarse");
let caja_login = document.querySelector(".caja-login");
let caja_registrarse = document.querySelector(".caja-registrarse");

function ancho_pagina() {
    if (window.innerWidth > 850) {
        caja_login.style.display = "block";
        caja_registrarse.style.display = "block";
    } else {
        caja_registrarse.style.display = "block";
        caja_registrarse.style.opacity = "1";
        caja_login.style.display = "none";
        formulario_login.style.display = "block";
        formulario_registrarse.style.display = "none";
        contenedor_login_registrarse.style.left = "0";
    }
}

ancho_pagina();

function registrarse() {
    if (window.innerWidth > 850) {
        formulario_registrarse.style.display = "block";
        contenedor_login_registrarse.style.left = "410px";
        formulario_login.style.display = "none";
        caja_registrarse.style.opacity = "0";
        caja_login.style.opacity = "1";
    } else {
        formulario_registrarse.style.display = "block";
        contenedor_login_registrarse.style.left = "0px";
        formulario_login.style.display = "none";
        caja_registrarse.style.display = "none";
        caja_login.style.display = "block";
        caja_login.style.opacity = "1";
    }
}

function iniciar() {
    if (window.innerWidth > 850) {
        formulario_registrarse.style.display = "none";
        contenedor_login_registrarse.style.left = "10px";
        formulario_login.style.display = "block";
        caja_registrarse.style.opacity = "1";
        caja_login.style.opacity = "0";
    } else {
        formulario_registrarse.style.display = "none";
        contenedor_login_registrarse.style.left = "0px";
        formulario_login.style.display = "block";
        caja_registrarse.style.display = "block";
        caja_login.style.display = "none";
    }
}