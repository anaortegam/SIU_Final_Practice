const socket = io();

let nav = document.querySelector("#nav1");
let abrir = document.querySelector("#abrir");
let cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})
let total = localStorage.getItem('total');

if (total !== null) {
    document.querySelector('.total').nextElementSibling.textContent = parseFloat(total).toFixed(2) + '€';
} else {
    console.log('No se encontró ningún total en el localStorage.');
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('boton-pagar').addEventListener('touchstart', function (event) {
        event.preventDefault();
        window.location.href = '../html/qr.html'; 
         
    });
});
document.addEventListener('DOMContentLoaded', function () {

    const contenedorLupa = document.getElementById('contenedor-lupa');
    const Lupa = document.getElementById('lupa-barra');
    const contenedorBuscador = document.querySelector('.contenedor-buscador');
    const logoLetras = document.querySelector('.logo_letras');
    const logoMenu = document.querySelector('.contenedor-menu');
    

    contenedorLupa.addEventListener('touchstart', function (event) {
        event.preventDefault();
        if (contenedorBuscador.style.display === 'none') {
            logoLetras.style.display = 'none';
            logoMenu.style.display = 'none';
            contenedorLupa.style.display = 'none';
            contenedorBuscador.style.display = 'flex';
        } else {
            contenedorBuscador.style.display = 'none';
            logoLetras.style.display = 'block';
            logoMenu.style.display = 'block';
            contenedorLupa.style.display = 'block';
        }
    });

    Lupa.addEventListener('touchstart', function (event) {
        event.preventDefault();
        if (Lupa.style.display === 'block') {
            logoLetras.style.display = 'block';
            logoMenu.style.display = 'block';
            contenedorLupa.style.display = 'block';
            contenedorBuscador.style.display = 'none';
        } else {
            Lupa.style.display = 'block';
            logoLetras.style.display = 'none';
            logoMenu.style.display = 'none';
            contenedorLupa.style.display = 'none';
        }
    });

    const microfono = document.getElementById('microfono');

    microfono.addEventListener('touchstart', function () {
        window.location.href = '../html/microfono.html'; 
    });
});


const escaneando = document.getElementById("btn-nfc");
escaneando.addEventListener("click", async function(){
    document.getElementById("escaneando").style.display = "none";
    document.getElementById("escaneado").style.display = "block";
    if ('NDEFReader' in window) {
        const ndef = new NDEFReader();
        try {
            await ndef.scan();
            console.log('Escaneo iniciado exitosamente.');
            ndef.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    let data = decoder.decode(record.data);
                    localStorage.setItem("nfc", data);
                    window.location = "../html/producto.html"
                }
            };
        } catch (error) {
            console.error('Error al iniciar el escaneo NFC', error);
            socket.emit('nfcError', 'Error al iniciar el escaneo NFC');
        }
    } else {
        console.log('La API Web NFC no está soportada en este navegador');
    }
})


