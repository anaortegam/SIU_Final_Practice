const socket = io();
socket.on('vibrar', function() {
    // Verificar si el navegador admite la API de vibración
    if ("vibrate" in navigator) {
        navigator.vibrate(1000);
    } else {
        console.log("El navegador no admite la API de vibración.");
    }
});
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
    // Función para generar el código QR
    generarCodigoQR(); 
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
        qrSection.style.display = 'block';
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
