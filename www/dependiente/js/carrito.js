document.addEventListener('DOMContentLoaded', function() {
    // Recuperar la información del carrito del local storage
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    if (carrito) {
        // document.getElementById('productosContainer').innerText = carrito;
        console.log('Información del carrito:', carrito);
        console.log('Tipo de dato:', typeof carrito);
        carrito = JSON.parse(carrito);
        carrito.forEach(producto => {
            const productoHTML = `
                <div class="producto1">                        
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="info-producto">
                        <span class="nombre_producto">${producto.nombre}</span>
                        <div class="cantidad-contenedor">
                            <span class="cantidad">Cantidad: ${producto.cantidad}</span>
                        </div>
                    </div>
                </div>
                <div class="linea"></div>
            `;
            productosContainer.innerHTML += productoHTML;
        });
    }
});


