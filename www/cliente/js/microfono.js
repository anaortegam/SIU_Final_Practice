const microSection = document.getElementById('micro');
const botonSection = document.getElementById('boton');
const socket = io();
let producto;
let nav = document.querySelector("#nav1");
let abrir = document.querySelector("#abrir");
let cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

socket.on('producto-micro-encontrado', function(producto) {
    console.log('Producto encontrado:', producto);

    localStorage.setItem('productoEncontrado', JSON.stringify(producto));

    window.location.href = 'producto.html';
});

document.addEventListener('DOMContentLoaded', function() {
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
        window.location.href = 'microfono.html';
    });

    // Event listener para el botón producto-info
    document.getElementById('producto-info').addEventListener('touchstart', function() {
        // console.log("Buscando información...");
        if(producto){
        socket.emit('producto-anadir', producto);}
        else{
            console.log("producto no esxiste")
        }
    });
    document.getElementById('plano-info').addEventListener('touchstart', function() {
        // console.log("Accediendo al plano...");
        if(producto){
            localStorage.setItem('productoEnPlano', producto);
        }
            else{
                console.log("producto no esxiste")
            }
        window.location.href = 'plano.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const micIcon = document.getElementById('contenedor-microfono');
    const statusMessage = document.getElementById('status-message');
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES'; 

    const keywords = {
        'calcetines de colores': '../../imgs/calcetines_colores.jpg',
        'camisa hombre' : '../../imgs/camisa_copia.jpg',
        'consola':'../../imgs/play.jpg',
        'velas':'../../imgs/velas.js'
    };

    micIcon.addEventListener('touchstart', () => {
        statusMessage.innerText = 'Escuchando...'; 
        recognition.start();
    });

    recognition.onresult = function(event) {
        statusMessage.innerText = ''; 
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        let matchFound = false;

        for (const keyword in keywords) {
            if (speechResult.includes(keyword)) {
                matchFound = true;
                const confirmar = confirm(`¿Has dicho ${keyword}?`);
                if (confirmar) {
                    microSection.style.display = 'none';
                    botonSection.style.display = 'block';
                    producto = keyword;
                    break;
                }
            }
        }

        if (!matchFound) {
            alert('Palabra clave no reconocida.');
        }
    };

    recognition.onend = function() {
        statusMessage.innerText = ''; 
        recognition.stop();
    };

    recognition.onerror = function(event) {
        console.error('Error en el reconocimiento de voz:', event.error);
    };
});
