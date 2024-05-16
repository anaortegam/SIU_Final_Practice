const socket = io();
let marcadorProducto=0;
let marcadorProductoEncontrado;
let posicionInicial = null;
let ultimaLatitud = null;
let ultimaLongitud = null; 
const factorPxPorMetro = 5;
let nav = document.querySelector("#nav1");
let abrir = document.querySelector("#abrir");
let cerrar = document.querySelector("#cerrar");
let puntoPartidaLatitud ; 
let puntoPartidaLongitud; 
let nombre;

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})
socket.on('producto-plano-encontrado', function(producto) {
    console.log('Producto encontrado:', producto);

    localStorage.setItem('productoEncontrado', JSON.stringify(producto));

    window.location.href = 'producto.html';
});


document.addEventListener('DOMContentLoaded', function () {
    const contenedorLupa = document.getElementById('contenedor-lupa');
    const Lupa = document.getElementById('lupa-barra');
    const contenedorBuscador = document.querySelector('.contenedor-buscador');
    const logoLetras = document.querySelector('.logo_letras');
    const logoMenu = document.querySelector('.contenedor-menu');
    // let totalRecuperado = localStorage.getItem('total');

    // if (totalRecuperado !== null) {
    //     // Actualizar el contenido de la etiqueta span con la clase "total"
    //     document.querySelector('.total').nextElementSibling.textContent = parseFloat(totalRecuperado).toFixed(2) + '€';
    // } else {
    //     console.log('No se encontró ningún total en el localStorage.');
    // }

    contenedorLupa.addEventListener('click', function (event) {
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
    Lupa.addEventListener('click', function (event) {
        event.preventDefault();
        if (Lupa.style.display === 'block') {
            logoLetras.style.display = 'block';
            logoMenu.style.display = 'block';
            contenedorLupa.style.display = '';
            contenedorBuscador.style.display = 'none';
        } else {
            Lupa.style.display = 'block';
            logoLetras.style.display = 'none';
            logoMenu.style.display = 'none';
            contenedorLupa.style.display = 'none';
        }
    });

    const microfono = document.getElementById('microfono');

    microfono.addEventListener('click', function () {
        window.location.href = '../html/microfono_almacen.html';
    });
});


window.onload = function()  {
    const productoEnPlano = localStorage.getItem('productoEnPlano');

    // Obtener todos los elementos img que representan marcadores de productos
    const marcadoresProductos = document.querySelectorAll('[id^="producto"]');

    // Iterar sobre cada marcador de producto
    marcadoresProductos.forEach(function(marcador) {
        // Obtener el nombre del producto del atributo alt
        const nombreProducto = marcador.getAttribute('alt');

        // Verificar si el nombre del producto coincide con el nombre del producto almacenado en localStorage
        if (nombreProducto === productoEnPlano) {
            // Mostrar el marcador correspondiente
            marcador.style.display = 'block';
            marcadorProductoEncontrado = marcador.id;
            console.log(`Ancho del plano: ${marcadorProductoEncontrado}`);

            localStorage.removeItem('productoEnPlano');
            marcadorProducto = 1;

            return;
        }
    });
    const plano = document.getElementById("plano");
    const usuario = document.getElementById("usuario");
    const posicion = document.getElementById("posicion");

    if (plano.clientWidth !== 0 && plano.clientHeight !== 0 && usuario.clientWidth !== 0 &&usuario.clientHeight !== 0 ) {
        console.log("Ambas imágenes ya están cargadas");

        // Obtener los anchos de las imágenes
        const anchoPlano = plano.clientWidth;
        const anchoUsuario = usuario.clientWidth;

        // Obtener las alturas de las imágenes
        const altoPlano = plano.clientHeight;
        const altoUsuario = usuario.clientHeight;

        // Mostrar la información de ancho y alto en el div de posición
        console.log( `Ancho del plano: ${anchoPlano}, Ancho del usuario: ${anchoUsuario}, Alto del plano: ${altoPlano}, Alto del usuario: ${altoUsuario}`);

        // Mostrar la ubicación inicial
        mostrarUbicacionInicial(anchoPlano, anchoUsuario);
        setInterval(function() {
            obtenerGeolocalizacion(function(position) {

                actualizarPosicionConstante(position, anchoPlano, anchoUsuario, altoPlano, altoUsuario);
            });
        }, 1000); 
    }
};

function obtenerGeolocalizacion(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback, function (error) {
            console.error("Error al obtener la ubicación:", error);
        });
    } else {
        alert("Geolocalización no es compatible en este navegador.");
    }
}


function actualizarPosicionConstante(position, anchoPlano, anchoUsuario, altoPlano, altoUsuario) {
    // console.log("Actualizar");
    let latitud;
    let longitud;
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;

    // Definir el rango permitido en longitud y latitud (grados)
    const rangoLongitud = 0.001; 
    const rangoLatitud = 0.001; 

    // Ajustar la longitud y latitud dentro del rango permitido
    longitud = Math.min(longitud + rangoLongitud, longitud); 
    longitud = Math.max(longitud - rangoLongitud, longitud); 
    latitud = Math.min(latitud + rangoLatitud, latitud); 
    latitud = Math.max(latitud - rangoLatitud, latitud); 
    // console.log(longitud);
    // console.log(latitud);
    calcularPosicion(longitud, latitud, altoPlano, anchoPlano,puntoPartidaLongitud,puntoPartidaLatitud);

    function calcularPosicion(longitud, latitud, altoContenedor, anchoContenedor, puntoPartidaLongitud, puntoPartidaLatitud) {
        // Calcular la diferencia entre la posición actual y el punto de partida
        const diferenciaLongitud = longitud - puntoPartidaLongitud;
        const diferenciaLatitud = latitud - puntoPartidaLatitud;
    
        // Convertir la diferencia a porcentajes dentro del rango permitido
        const porcentajeLongitud = ((diferenciaLongitud + 0.001) / 0.002) * 100;
        const porcentajeLatitud = ((diferenciaLatitud + 0.001) / 0.002) * 100;
    
        // Calcular la posición horizontal del marcador dentro del rango permitido
        let posicionHorizontal = (porcentajeLongitud / 100) * anchoContenedor;
    
        // Ajustar la posición horizontal para que esté dentro del rango permitido
        if (posicionHorizontal < 0) {
            posicionHorizontal = 0; 
        } else if (posicionHorizontal > anchoContenedor - 25) {
            posicionHorizontal = anchoContenedor - 25; 
        }
    
        // Calcular la posición vertical del marcador dentro del rango permitido
        let posicionVertical = (porcentajeLatitud / 100) * altoContenedor;
    
        // Ajustar la posición vertical para que esté dentro del rango permitido
        if (posicionVertical < 0) {
            posicionVertical = 0; 
        } else if (posicionVertical > altoContenedor - 25) {
            posicionVertical = altoContenedor - 25; 
        }
    
        const usuario = document.getElementById("usuario");
        usuario.style.left = `${posicionHorizontal + 650}px`;
        usuario.style.bottom = `${posicionVertical + 390}px`;
    }    
}
    
       
    
document.addEventListener('DOMContentLoaded', function () {

    
    // Obtener referencias a los marcadores de productos
    const productos = document.querySelectorAll('[id^="producto"]');

    // Función para mostrar el popup durante 5 segundos
    function mostrarPopup(nombreProducto, left, top) {
        console.log('mostrandopopup');
        const popup = document.getElementById('popup');
        const nombreProductoSpan = document.getElementById('nombreProducto');
        if (nombre){
            nombreProductoSpan.textContent = nombre;
        }
        else{
            nombreProductoSpan.textContent = nombreProducto;
        }
        popup.style.left = `${left}px`;
        popup.style.top = `${top - popup.offsetHeight}px`;
        popup.style.display = 'block';

        setTimeout(function() {
            popup.style.display = 'none';
        }, 5000);
    }

    // Agregar eventos de touchstart, touchend y touchhold a cada marcador de producto
    productos.forEach(function(producto) {
        let startTime; // Variable para almacenar el tiempo de inicio del toque

        producto.addEventListener('click', function(event) {
            event.stopPropagation(); 
            event.preventDefault(); 
            const nombreProducto = this.alt; 

            const rect = this.getBoundingClientRect();
            const left = rect.left + window.scrollX;
            const top = rect.top + window.scrollY;

            // Mostrar el popup durante 5 segundos
            mostrarPopup(nombreProducto, left, top);

            // Guardar el tiempo de inicio del toque
            startTime = new Date().getTime();

        });

        // Cancelar el temporizador si se levanta el dedo antes de 5 segundos
        producto.addEventListener('touchend', function() {
            const endTime = new Date().getTime();
            const touchDuration = endTime - startTime;

            // Si la duración del toque es mayor a 5 segundos, redirigir a producto.html
            if (touchDuration >= 5000) {
                console.log("Se mantuvo pulsado durante más de 5 segundos.");
                const nombreProducto = producto.alt;
                socket.emit('producto-plano', nombreProducto);
            }
        });
    });
});

function mostrarUbicacionInicial(anchoPlano, anchoUsuario) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('Geolocalización obtenida');
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;

            ultimaLatitud = latitud;
            ultimaLongitud = longitud;

            if (!posicionInicial) {
                // Si es la primera vez, almacenamos la posición inicial
                posicionInicial = (anchoPlano - anchoUsuario) / 2; // Centramos el marcador horizontalmente
            }
            puntoPartidaLatitud = latitud+(0.00075); // Latitud del punto de partida
            puntoPartidaLongitud =longitud; 
            
            const usuario = document.getElementById("usuario");
            if (!usuario) {
                console.log('Elemento "usuario" no encontrado');
                return;
            }
            usuario.style.left = `${posicionInicial}px`;
            usuario.style.bottom = "0"; 
            usuario.style.transform = "translateX(-50%)";
            usuario.style.position = "absolute"; 

            // Mostrar la posición en el HTML
            const posicionDiv = document.getElementById("posicion");
            if (!posicionDiv) {
                console.log('Elemento "posicion" no encontrado');
                return;
            }
            posicionDiv.innerText = `Latitud: ${latitud}, Longitud: ${longitud}`;
            if (marcadorProducto === 0) {
                for (let i = 1; i <= 4; i++) {
                    const idProducto = `producto${i}`;
                    const producto = document.getElementById(idProducto);
                    
                    if (!producto) {
                        console.log(`Elemento "${idProducto}" no encontrado`);
                        continue;
                    }
                    if ("producto1"===idProducto){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 540}px`; 
                        producto.style.bottom = "340px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px"; }
                    if ("producto2"===idProducto){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 300}px`; 
                        producto.style.bottom = "140px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px"; }
                    if ("producto3"===idProducto){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 425}px`; 
                        producto.style.bottom = "290px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px"; }
                    if ("producto4"===idProducto){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 200}px`; 
                        producto.style.bottom = "380px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px"; 
                    }
                }
            }  
            //console.log(`Ancho del plano: ${marcadorProducto}`);  
            if (marcadorProducto===1){
                for (let i = 1; i <= 4; i++) {
                    const idProducto = `producto${i}`;
                    const producto = document.getElementById(idProducto);
                    
                    if (!producto) {
                        console.log(`Elemento "${idProducto}" no encontrado`);
                        continue; 
                    }
                    console.log(`Ancho del plano: ${marcadorProductoEncontrado}`);
                    if (marcadorProductoEncontrado==="producto1"){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 540}px`; 
                        producto.style.bottom = "340px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px";
                        nombre = "calcetines de colores"; }
                    if (marcadorProductoEncontrado==="producto2"){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 300}px`; 
                        producto.style.bottom = "140px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px";
                        nombre = "consola"; }
                    if (marcadorProductoEncontrado==="producto3"){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 425}px`; 
                        producto.style.bottom = "490px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px";
                        nombre = "velas"; }
                    if (marcadorProductoEncontrado==="producto4"){
                        // Establecer los estilos del producto
                        producto.style.left = `${posicionInicial + 200}px`; 
                        producto.style.bottom = "580px";
                        producto.style.position = "absolute";
                        producto.style.display = 'block';
                        producto.style.width = "50px";
                        nombre = "camisa hombre"; }
            }  
        }       
        }, function (error) {
            console.error("Error al obtener la ubicación:", error);
        });
    } else {
        alert("Geolocalización no es compatible en este navegador.");
    }
}
