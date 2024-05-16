const socket = io();
let numero_prod = 0;
let tics;
const contenedorProducto = document.getElementById('productos-container');
document.addEventListener('DOMContentLoaded', function() {
    // Emitir un evento para solicitar el carrito desde el servidor
    socket.emit('carrito-almacen');

    // Escuchar el evento 'carrito-ordenado' enviado por el servidor
    socket.on('carrito-recivido', (carrito) => {
        // Guardar 'carrito' en localStorage con la clave 'carrito'
            localStorage.setItem('carrito_dep', JSON.stringify(carrito));
        }
    );

    // Recuperar la información del carrito del localStorage
    let carritoGuardado = localStorage.getItem('carrito_dep');
    carritoGuardado = JSON.parse(carritoGuardado)
    console.log(carritoGuardado);
    if (carritoGuardado) {
        // Filtrar los productos que tienen el atributo NFC
        const productosSinNFC = carritoGuardado.filter(producto => !producto.hasOwnProperty('NFC'));
        console.log(productosSinNFC);
        // Generar el HTML para los productos sin NFC
        productosSinNFC.forEach((producto, index) => {
            numero_prod = numero_prod + 1;
            console.log('numero-prod', numero_prod);
            const productoHTML = `
                <div class="producto1">                        
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="info-producto">
                        <span class="nombre_producto">${producto.nombre}</span>
                        <div class="cantidad-contenedor">
                            <span class="cantidad">Cantidad: ${producto.cantidad}</span>
                        </div>
                    </div>
                    <div class ="tick">
                            <img src="/imgs/x.png" alt="check" id="imagenX_${index}">
                    </div>
                </div>
                <div class="linea"></div>
            `;
            // Creamos la lista dentro del HTML
            contenedorProducto.innerHTML += productoHTML;
        });
    }
});

//funcion que se encarga de actualizar la lista con los clicks del usuario y comprabar si está preparado
document.addEventListener('DOMContentLoaded', function () {
    // total de imagenes en la lista
    const totalImagenes = numero_prod; 

    for (let index = 0; index < totalImagenes; index++) {
        const imagen = document.getElementById(`imagenX_${index}`);
        imagen.addEventListener('click', function () {
            if (imagen.src.endsWith('/imgs/x.png')) {
                imagen.src = '/imgs/tic.png';
                if (tics){
                    tics = tics + 1;
                }else{
                    tics = 1;
                }
                console.log('tics', tics);
                if (numero_prod === tics) {
                    // pedido preparado, vaciado y envio de vibración al usuario
                    console.log('mas tics', tics);
                    localStorage.removeItem('carrito_dep');
                    socket.emit('listo', 'listo');
                    window.location.href = '../html/pedido_procesado_almacen.html';
                }
            } else {
                imagen.src = '/imgs/x.png';
                if (tics <= 1){
                    tics = 0;
                }else{
                    tics = tics - 1;
                }
                console.log('tics', tics);
            }
        });
    }
});





