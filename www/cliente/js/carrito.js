const socket = io();
let total=0;

document.addEventListener('DOMContentLoaded', function () {
    console.log("llamando a función");
    comprobarCarrito();
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

    microfono.addEventListener('touchstart', function () {
        window.location.href = '../html/microfono.html'; 
    });
});

function comprobarCarrito() {
    const productoString = localStorage.getItem('producto');

    if (productoString) {

        const productos = JSON.parse(productoString);
        console.log("holaaa", productos);
        const contenedorProductos = document.getElementById('contenedor_productos');

        // Limpiar el contenedor antes de mostrar los nuevos productos
        contenedorProductos.innerHTML = '';
        if (productos != null){
            total=0;

            productos.forEach(producto => {
                mostrarProductoEnHTML(producto);
                // Actualizar el precio total
                document.querySelector('.total').nextElementSibling.textContent = total.toFixed(2) + '€';
                localStorage.setItem('total', total);
        });
        }
    } else {
        console.log('No se encontró ningún producto en el localStorage.');
    }
}

function mostrarProductoEnHTML(producto) {
    const contenedorProductos = document.getElementById('contenedor_productos');

    // Crear un div para el producto
    const nuevoProducto = document.createElement('div');
    nuevoProducto.id = "producto" + producto.id;
    nuevoProducto.classList.add("producto");

    // Crear el elemento para la imagen del producto
    const imagenProducto = document.createElement('img');
    imagenProducto.src = producto.imagen;
    imagenProducto.alt = "Producto " + producto.id;

    // Crear un div para la información del producto
    const infoProducto = document.createElement('div');
    infoProducto.classList.add("info-producto");

    const nombreProducto = document.createElement('span');
    nombreProducto.classList.add("nombre_producto");
    nombreProducto.textContent = producto.nombre;

    
    const cantidadContenedor = document.createElement('div');
    cantidadContenedor.classList.add("cantidad-contenedor");

    const cantidadSpan = document.createElement('span');
    cantidadSpan.classList.add("cantidad");
    cantidadSpan.textContent = "Cantidad: ";

    const cantidadProducto = document.createElement('span');
    cantidadProducto.id = "cantidadProducto";
    cantidadProducto.textContent = producto.cantidad;
    total += producto.cantidad * producto.precio;
    console.log(total);

    // Crear botones para aumentar y disminuir la cantidad
    const botonMas = document.createElement('button');
    botonMas.classList.add("boton-mas");
    botonMas.textContent = "+";

    const botonMenos = document.createElement('button');
    botonMenos.classList.add("boton-menos");
    botonMenos.textContent = "-";

    botonMas.addEventListener('touchstart', function() {
        
        console.log("Producto añadido");
        socket.emit("anadir-cantidad", producto.nombre);
        socket.on('producto-masuno',  (carrito) => {
            
            console.log('Carrito actualizado recibido:', carrito);
            contenedorProductos.innerHTML = '';
            
            console.log(typeof (carrito));
            const carritoString = JSON.stringify(carrito);

            // Guardar en local storage
            localStorage.setItem('producto', carritoString);

            if (typeof carrito === 'object' && carrito !== null) {
                total = 0;
                // Recorrer el carrito
                for (const key in carrito) {
                    if (carrito.hasOwnProperty(key)) {
                        const producto = carrito[key];
                        // Mostrar el producto en la consola
                        console.log('Nombre del producto:', producto.nombre);
                        console.log('Cantidad:', producto.cantidad);

                        // Mostrar el producto en HTML
                        mostrarProductoEnHTML(producto);
                        eliminandoProducto = false;
                    }
                }
                // Actualiza el precio total
                document.querySelector('.total').nextElementSibling.textContent = total.toFixed(2) + '€';
                localStorage.setItem('total', total);
            }
        });
    });

    // Eliminar mediante botón
    botonMenos.addEventListener('touchstart', function() {
        // Disminuir la cantidad del producto
        console.log("Producto eliminado");
        socket.emit('eliminar-carrito', producto.nombre);
        socket.on('producto-eliminado', (carrito) => {
            
            console.log('Carrito actualizado recibido:', carrito);
            contenedorProductos.innerHTML = '';
            
            console.log(typeof (carrito));
            const carritoString = JSON.stringify(carrito);

            // Guardar en local storage
            localStorage.setItem('producto', carritoString);

            if (typeof carrito === 'object' && carrito !== null) {
                total=0;
                // Recorrer el carrito
                for (const key in carrito) {
                    if (carrito.hasOwnProperty(key)) {
                        const producto = carrito[key];
                        // Mostrar el producto en la consola
                        console.log('Nombre del producto:', producto.nombre);
                        console.log('Cantidad:', producto.cantidad);

                        // Mostrar el producto en HTML
                        mostrarProductoEnHTML(producto);
                        eliminandoProducto = false;
                    }

                }
                // Actualiza el precio total
                document.querySelector('.total').nextElementSibling.textContent = total.toFixed(2) + '€';
                localStorage.setItem('total', total);

            } else {
                console.log('El carrito recibido no es un objeto válido.');
                eliminandoProducto = false;
            }
        });
    });


    // Agregar los elementos creados al DOM
    cantidadContenedor.appendChild(cantidadSpan);
    cantidadContenedor.appendChild(cantidadProducto);
    cantidadContenedor.appendChild(botonMas);
    cantidadContenedor.appendChild(botonMenos);
    infoProducto.appendChild(nombreProducto);
    infoProducto.appendChild(cantidadContenedor);
    nuevoProducto.appendChild(imagenProducto);
    nuevoProducto.appendChild(infoProducto);
    contenedorProductos.appendChild(nuevoProducto);
    return;
}




document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('boton-pagar').addEventListener('touchstart', function (event) {
        event.preventDefault();
        window.location.href = '../html/qr.html'; 
         
    });
});

// Mostrar y ocultar menu hamburguesa
var nav = document.querySelector("#nav1");
var abrir = document.querySelector("#abrir");
var cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
});

// Ordenar el carrito
function reordenarContenedores(lista, contenedorMovido, direccionMovimiento) {

    // Extraer el nombre del producto que se está moviendo 
    const contenedorProductos = document.getElementById('contenedor_productos');
    const nombreProductoMovido = contenedorMovido.querySelector('.nombre_producto').textContent;
    const indexMovido = lista.indexOf(nombreProductoMovido);

    // Calcular indices para detectar movimiento
    let indexTarget = indexMovido + direccionMovimiento;
    if (indexTarget < 0) {
        indexTarget = 0;
    }
    if (indexTarget >= lista.length) {
        indexTarget = lista.length - 1;
    }
    console.log(indexTarget);
    console.log(indexMovido);

    // Se reordena la lista
    lista.splice(indexMovido, 1);
    lista.splice(indexTarget, 0, nombreProductoMovido);
    console.log("Lista de nombres reordenada:", lista);
    socket.emit('lista-nombres', lista);
    socket.on('carrito-ordenado', (carrito) => {
        console.log('Carrito actualizado recibido:', carrito);
        contenedorProductos.innerHTML = '';

        console.log(typeof (carrito));
        const carritoString = JSON.stringify(carrito);

        localStorage.setItem('producto', carritoString);

        if (typeof carrito === 'object' && carrito !== null) {
            
            total = 0;
            for (const key in carrito) {
                if (carrito.hasOwnProperty(key)) {
                    const producto = carrito[key];

                    // console.log('Nombre del producto:', producto.nombre);
                    // console.log('Cantidad:', producto.cantidad);
                    mostrarProductoEnHTML(producto);
                }
            } 
            // Actualizar el precio total
            document.querySelector('.total').nextElementSibling.textContent = total.toFixed(2) + '€';
            localStorage.setItem('total', total);

        } else {
            console.log('El carrito recibido no es un objeto válido.');
            eliminandoProducto = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    const contenedorProductos = document.getElementById('contenedor_productos');
    let xInicial;
    let contenedorProducto;
    let eliminandoProducto = false;
    let desplazamientoActual = 0;
    let touchStartY;
    let touchStartTime;
    let currentTouchMoveY;
    let touchMoveStarted = false;
    const contenedores = contenedorProductos.querySelectorAll('.producto');
    let lista = [];
    contenedores.forEach(contenedor => {
        // Obtener el nombre del producto del contenedor actual
        const nombreProducto = contenedor.querySelector('.nombre_producto').textContent;
        lista.push(nombreProducto);
        console.log('Nombre del producto:', nombreProducto);
    });
    contenedorProductos.addEventListener('touchstart', function (event) {
        if (eliminandoProducto) return;
        xInicial = event.touches[0].clientX;
        contenedorProducto = event.target.closest('.producto');
        desplazamientoActual = 0;
        touchStartY = event.touches[0].clientY;
        touchStartTime = new Date().getTime();
        currentTouchMoveY = touchStartY;
        touchMoveStarted = false;
    });
    contenedorProductos.addEventListener('touchmove', function (event) {
        if (eliminandoProducto || !contenedorProducto) return;
        const desplazamiento = event.touches[0].clientX - xInicial;
        desplazamientoActual = desplazamiento;
        contenedorProducto.style.transition = 'none';
        contenedorProducto.style.transform = `translateX(${desplazamiento}px)`;
        currentTouchMoveY = event.touches[0].clientY;
        touchMoveStarted = true;
    });
    contenedorProductos.addEventListener('touchend', function (event) {
        const touchEndTime = new Date().getTime();
        const touchDuration = touchEndTime - touchStartTime;
        const touchDistance = currentTouchMoveY - touchStartY;
        if (eliminandoProducto || !contenedorProducto) return;
        const nombreProducto = contenedorProducto.querySelector('.nombre_producto').textContent;
        if (touchDuration >= 3000 && touchMoveStarted) {
            // console.log("Mantenido pulsado durante 3 segundos");
            const contenedorMovido = event.target.closest('.producto');
            // console.log(contenedorMovido);
            const alturaContenedor = contenedorMovido.offsetHeight;
            const direccionMovimiento = Math.round(touchDistance / alturaContenedor);
            reordenarContenedores(lista, contenedorMovido, direccionMovimiento);
        }
    
        if (desplazamientoActual < -50) {
            if (confirm("¿Seguro que deseas eliminar este producto?")) {
                eliminandoProducto = true;
                contenedorProducto.style.transition = 'transform 0.3s ease';
                contenedorProducto.style.transform = 'translateX(-100%)';
                contenedorProducto.addEventListener('transitionend', function () {
                    contenedorProducto.remove();
                    eliminandoProducto = false;

                }, { once: true });
                socket.emit('eliminar-carrito', nombreProducto);
                socket.on('producto-eliminado', (carrito) => {
                    
                    console.log('Carrito actualizado recibido:', carrito);
                    contenedorProductos.innerHTML = '';
                    console.log(typeof (carrito));
                    const carritoString = JSON.stringify(carrito);

                    localStorage.setItem('producto', carritoString);

                    if (typeof carrito === 'object' && carrito !== null) {
                        total=0;
                        for (const key in carrito) {
                            if (carrito.hasOwnProperty(key)) {
                                const producto = carrito[key];
                                // console.log('Nombre del producto:', producto.nombre);
                                // console.log('Cantidad:', producto.cantidad);

                                // Mostrar el producto en el HTML
                                mostrarProductoEnHTML(producto);
                                eliminandoProducto = false;
                            }

                        }
                        // Actualiza el precio total
                        document.querySelector('.total').nextElementSibling.textContent = total.toFixed(2) + '€';
                        localStorage.setItem('total', total);
                    } else {
                        console.log('El carrito recibido no es un objeto válido.');
                        eliminandoProducto = false;
                    }
                });
            } else {
                contenedorProducto.style.transition = 'transform 0.3s ease';
                contenedorProducto.style.transform = 'translateX(0)';
                eliminandoProducto = false;
            }
        } else {
            contenedorProducto.style.transition = 'transform 0.3s ease';
            contenedorProducto.style.transform = 'translateX(0)';
            eliminandoProducto = false;
        }
    });
});
