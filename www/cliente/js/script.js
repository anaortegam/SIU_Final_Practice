
addEventListener("load", function(){
    const inicio = localStorage.getItem("cliente");
    if (inicio == 1){
        seccionRegistro.style.display = 'none';
        seccionInicioSesion.style.display = 'none';
        seccionMenuCliente.style.display = 'none';
        seccionHome.style.display = 'block';
    }
})


const botonInicioSesion = document.getElementById('boton-inicio-sesion-menu');
const botonRegistro = document.getElementById('boton-registro');
const botonHome = document.getElementById('boton-log');
const botonHome2 = document.getElementById('boton-home');
const seccionMenuCliente = document.getElementById('menu_cliente');
const seccionInicioSesion = document.getElementById('inicio_sesion');
const seccionRegistro = document.getElementById('registro');
const seccionHome = document.getElementById('home');

botonInicioSesion.addEventListener('click', function() {
    seccionMenuCliente.style.display = 'none';
    seccionInicioSesion.style.display = 'block';
    seccionRegistro.style.display = 'none';
    seccionHome.style.display = 'none';
});

botonRegistro.addEventListener('click', function() {
    seccionRegistro.style.display = 'block';
    seccionInicioSesion.style.display = 'none';
    seccionMenuCliente.style.display = 'none';
    seccionHome.style.display = 'none';
});

botonHome.addEventListener('click', function() {
    seccionRegistro.style.display = 'none';
    seccionInicioSesion.style.display = 'none';
    seccionMenuCliente.style.display = 'none';
    seccionHome.style.display = 'block';
    localStorage.setItem('cliente', 1);
});

document.getElementById('boton-home').addEventListener('click', function() {
    let checkbox = document.getElementById('check');
    let nombre = document.getElementById('nombre').value;
    let email = document.getElementById('email').value;
    let usuario = document.getElementById('usuario2').value;
    let contrasena = document.getElementById('contrasena2').value;
    
    if (!checkbox.checked) {
        alert('Debes aceptar las condiciones de uso para poder registrarte.');
    } else if (!nombre || !email || !usuario || !contrasena) {
        alert('Todos los campos deben estar llenos para poder registrarte.');
    } else {
        seccionRegistro.style.display = 'none';
        seccionInicioSesion.style.display = 'none';
        seccionMenuCliente.style.display = 'none';
        seccionHome.style.display = 'block';  
    }

});


