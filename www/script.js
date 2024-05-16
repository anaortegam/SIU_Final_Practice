

const cliente = document.getElementById('cliente');
const empleado = document.getElementById('empleado');


cliente.addEventListener('click', () => {
    // abrir el html de cliente
    window.open('cliente/html/home.html');
    console.log('Cliente');
});
empleado.addEventListener('click', () => {
    window.open('dependiente/html/home.html');
    console.log('Empleado');
});