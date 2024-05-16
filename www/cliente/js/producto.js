let productoAnadido;

const socket = io();
let nombre;
let total = localStorage.getItem('total');

    if (total !== null) {
        document.querySelector('.total').nextElementSibling.textContent = parseFloat(total).toFixed(2) + '€';
    } else {
        console.log('No se encontró ningún total en el localStorage.');
    }
addEventListener("load", function () {
    const mensajeDiv = document.getElementById('mensaje');
    const productoEncontrado = JSON.parse(localStorage.getItem('productoEncontrado'));
    console.log(productoEncontrado);
    if (productoEncontrado != null) {
        console.log('Tipo de producto encontrado:', typeof productoEncontrado);
        console.log('Producto encontrado en producto.html:', productoEncontrado);
        productoAnadido = productoEncontrado;
        console.log('Producto añadido:', productoAnadido);
        mostrarProductoEnHTML(productoEncontrado);
        
    }
    // Eliminar la información del producto del almacenamiento local después de usarla
    localStorage.removeItem('productoEncontrado');
});
document.addEventListener('DOMContentLoaded', function () {
    // Función para generar el código QR
    function generarCodigoQR() {
        // Obtener los productos del carrito
        var productosQR = [];
        var productosLocalStorage = JSON.parse(localStorage.getItem('producto'));
        console.log("HOLAAA", productosLocalStorage);

        // Verificar si hay datos en el localStorage
        if (productosLocalStorage) {
            // Iterar sobre los productos almacenados en el localStorage
            productosLocalStorage.forEach(function(producto) {
                // Obtener los atributos necesarios de cada producto
                var nombre = producto.nombre;
                var cantidad = producto.cantidad;
                var imagen = producto.imagen;
                console.log('Nombre:', nombre);
                console.log('Cantidad:', cantidad);
                console.log('Imagen:', imagen);
                productosQR.push({ nombre: nombre, cantidad: cantidad, imagen: imagen, total: total });
            });
        } else {
            console.log('No hay productos en el carrito.');
        }

        let textoProductos = JSON.stringify(productosQR);

        // Generar el código QR
        let qr = qrcode(0, 'L');
        qr.addData(textoProductos);
        qr.make();
        let qrSection = document.getElementById('qr');
        let carritoSection = document.getElementById('tarjeta');
        qrSection.style.display = 'block';
        carritoSection.style.display = 'none';
        // Obtener el elemento contenedor del código QR
        let qrCodeContainer = document.getElementById('qrCodeContainer');

        // Eliminar cualquier código QR anterior
        qrCodeContainer.innerHTML = '';

        // Insertar el código QR en el contenedor
        let qrImg = document.createElement('img');
        qrImg.src = qr.createDataURL(10); 
        qrCodeContainer.appendChild(qrImg);
    }

    document.getElementById('boton-pagar').addEventListener('touchstart', function (event) {
        event.preventDefault();
        generarCodigoQR(); 
    });
});

addEventListener("load", function () {
    const nfc = localStorage.getItem("nfc");
    enviarIDAlServidor(nfc);
    localStorage.removeItem("nfc");
})

var nav = document.querySelector("#nav1");
var abrir = document.querySelector("#abrir");
var cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
});

function enviarIDAlServidor(id) {
    console.log('ID producto:', id);
    socket.emit('id', id);
}
socket.on('producto-micro-producto-encontrado', function (producto) {
    console.log('Producto encontrado:', producto);
    mostrarProductoEnHTML(producto);
});
socket.on('producto-encontrado', function (producto) {
    console.log('Producto encontrado:', producto);
    // localStorage.setItem('productoEncontrado', JSON.stringify(producto));
    productoAnadido = producto;
    productoAnadido.NFC = 1;
    console.log('Producto añadido:', productoAnadido);
    mostrarProductoEnHTML(producto);
});
// Escuchar evento 'producto-encontrado' del servidor


function generarEstrellas(valoracion) {
    let estrellasHTML = '';
    // Generar estrellas según la valoración
    for (let i = 0; i < valoracion; i++) {
        estrellasHTML += '<img class="estrella" src="../../imgs/estrella.png" alt="Estrella">';
    }
    // Generar estrellas blancas para completar hasta llegar a 5
    for (let i = valoracion; i < 5; i++) {
        estrellasHTML += '<img class="estrella" src="../../imgs/estrella_blanca.png" alt="Estrella blanca">';
    }
    return estrellasHTML;
}


function mostrarProductoEnHTML(producto) {
    console.log('Producto', producto)
    nombre = producto.nombre;
    const contenedorProducto = document.getElementById('tarjeta');
    console.log(typeof producto.tipo);
    console.log(producto.tipo);
    if (producto.tipo == "ropa") {
        const estrellasHTML = generarEstrellas(producto.valoracion); // Generar las estrellas
        const productoHTML = `
            <div class="producto">  
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="contenedor-acept-no">
                    <h3>Cancelar</h3>
                    <div class="flechas">
                        <img src="../../imgs/flecha_izq.png">
                        <img src="../../imgs/flecha_dcha.png">
                    </div>
                    <h3>Agregar al carrito</h3>
                </div>
            </div>
            <div class="info-producto">
                <span class="cantidad">Cantidad: ${producto.tallas}</span>
                <span class="stock">Stock: ${producto.stock}</span>
                <span class="precio">Precio: ${producto.precio}</span>
                <span class="precio">Puntuación:</span>
                <div class="valoracion">${estrellasHTML}</div> 
            </div>
        `;
        contenedorProducto.innerHTML = productoHTML;
    }
    if (producto.tipo == "hogar" || producto.tipo == "electronica") {
        const estrellasHTML = generarEstrellas(producto.valoracion); // Generar las estrellas
        const productoHTML = `
            <div class="producto">  
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="contenedor-acept-no">
                    <h3>Cancelar</h3>
                    <div class="flechas">
                        <img src="../../imgs/flecha_izq.png">
                        <img src="../../imgs/flecha_dcha.png">
                    </div>
                    <h3>Agregar al carrito</h3>
                </div>
            </div>
            <div class="info-producto">
                <span class="stock">Stock: ${producto.stock}</span>
                <span class="precio">Precio: ${producto.precio}</span>
                <span class="precio">Puntuación:</span>
                <div class="valoracion">${estrellasHTML}</div> 
            </div>
        `;
        contenedorProducto.innerHTML = productoHTML;
    }
}

// Esta es una función de ejemplo para mostrar el mensaje de error en el HTML
function mostrarMensajeErrorEnHTML(mensaje) {
    console.log('Error al enviar el producto.')
}

document.addEventListener('DOMContentLoaded', function () {
    const contenedorLupa = document.getElementById('contenedor-lupa');
    const Lupa = document.getElementById('lupa-barra');
    const contenedorBuscador = document.querySelector('.contenedor-buscador');
    const logoLetras = document.querySelector('.logo_letras');
    const logoMenu = document.querySelector('.logo_menu');

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
        window.location.href = '../html/microfono.html'; // Redireccionar al usuario a microfono.html
    });
});



const DECISION_THRESHOLD = 75

let isAnimating = false
let pullDeltaX = 0 

// movimiento tarjetas
function startDrag(event) {
    if (isAnimating) return

    
    const actualCard = event.target.closest('img')
    
    if (!actualCard) return

    
    const startX = event.pageX ?? event.touches[0].pageX

    
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove(event) {
        
        const currentX = event.pageX ?? event.touches[0].pageX

        
        pullDeltaX = currentX - startX

        if (pullDeltaX === 0) return

        isAnimating = true;
        const deg = pullDeltaX / 10
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

        
        actualCard.style.cursor = 'grabbing'
        
    }

    function onEnd(event) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if(decisionMade){
            const goRight = pullDeltaX >= 0
            const goLeft = pullDeltaX <= 0

            if(goRight){
                actualCard.classList.add(goRight ? 'go-right' : 'go-left')
                actualCard.addEventListener('transitionend', () =>{
                actualCard.remove()
                ocultarDivs();
                mostrarMensajeAgregado()
                enviarProductoAlServidor(productoAnadido);
                })
            }

            if (goLeft){
                actualCard.classList.add(goRight ? 'go-right' : 'go-left')
                actualCard.addEventListener('transitionend', () =>{
                actualCard.remove()
                ocultarDivs();
                window.location.href = 'carrito.html';
                })
            }
            
            console.log('desicion hecha')
            
        }else{
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right', 'go-left')
        }

        actualCard.addEventListener('transitionend', () =>{
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')
            
            pullDeltaX = 0
            isAnimating = false
        })
    }

}
function enviarProductoAlServidor(productoAnadido){
    console.log('Datos del carrito a enviar al servidor:', productoAnadido);
    socket.emit('guardar-carrito',productoAnadido ); 
    socket.on('producto-carrito', function (producto) {
        console.log('Producto encontrado:', producto);
        console.log(typeof producto );
        const productoString = JSON.stringify(producto);
        // Guardar el producto en el localStorage
        localStorage.setItem('producto', productoString);
    });
}

const header = document.querySelector('header');
const footer = document.querySelector('footer');
document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })

function ocultarDivs() {
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
        const tagName = div.tagName.toLowerCase();
        if (tagName !== 'header' && tagName !== 'footer' && !isDescendant(header, div) && !isDescendant(footer, div)) {
            div.style.display = 'none';
        }
    });
}

function isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function mostrarMensajeAgregado() {
    
    const mensajeAgregado = document.createElement('div');
    mensajeAgregado.classList.add('mensaje-agregado'); 

    mensajeAgregado.style.backgroundColor = 'white';
    mensajeAgregado.style.border = 'solid 4px #44b159';
    mensajeAgregado.style.position = 'fixed';
    mensajeAgregado.style.top = '50%';
    mensajeAgregado.style.left = '50%';
    mensajeAgregado.style.transform = 'translate(-50%, -50%)';
    mensajeAgregado.style.padding = '20px';
    mensajeAgregado.style.borderRadius = '10px';
    mensajeAgregado.style.zIndex = '9999'; 

   
    const mensajeTexto = document.createElement('p');
    mensajeTexto.textContent = 'Este producto ha sido añadido a tu carrito';
    mensajeAgregado.appendChild(mensajeTexto);

   
    const botonOK = document.createElement('button');
    botonOK.textContent = 'OK';
    botonOK.style.marginTop = '10px';
    botonOK.style.padding = '5px 10px';
    botonOK.style.backgroundColor = 'white';
    botonOK.style.border = '1px solid black';
    botonOK.style.borderRadius = '5px';
    botonOK.style.cursor = 'pointer';
    botonOK.addEventListener('click', function() {
        window.location.href = 'carrito.html'; 
    });
    mensajeAgregado.appendChild(botonOK);

    document.body.appendChild(mensajeAgregado);
}

// Agitar para añadir a favs

// Agregar listener para el evento 'devicemotion' cuando el documento se carga
document.addEventListener('DOMContentLoaded', function () {
    // Establecer el umbral de detección de movimiento
    const MOVEMENT_THRESHOLD = 35; // Este valor puede variar según la sensibilidad deseada
 
    // Función para manejar el evento 'devicemotion'
    function handleMotion(event) {
        // Obtener la aceleración en los ejes x, y, z
        const acceleration = event.accelerationIncludingGravity;

        // Calcular la magnitud del vector de aceleración
        const magnitude = Math.sqrt(
            Math.pow(acceleration.x, 2) +
            Math.pow(acceleration.y, 2) +
            Math.pow(acceleration.z, 2)
        );

    
        // Verificar si la magnitud supera el umbral de detección de movimiento
        if (magnitude > MOVEMENT_THRESHOLD) {
            console.log('¡Movimiento detectado!');
            // Redireccionar a la página deseada
            console.log("nombrreee", nombre);
            socket.emit('favorito', nombre);
            socket.on('favorito-producto', function (carrito){
                console.log('Producto encontrado:', carrito);
                const productoString = JSON.stringify(carrito);
                // Guardar el producto en el localStorage
                localStorage.setItem('favoritos', productoString);
                window.location.href = 'addFavorito.html';
            });
        }
    }

    // Agregar el listener para el evento 'devicemotion'
    window.addEventListener('devicemotion', handleMotion);
});


