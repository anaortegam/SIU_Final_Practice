const express = require('express');
const fs = require('fs');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let carrito = []; // Inicializar el carrito vacío

// Middleware para el análisis del cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cargar el almacén desde el archivo JSON
let almacen = [];

let pago = false;
let listo = false;

function vibrarCliente() {
    if (pago && listo) {
        io.emit('vibrar', 'vibrar');
        pago = false;
        listo = false;
    }
}

fs.readFile('almacen.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al cargar el almacén:', err);
        return;
    }
    almacen = JSON.parse(data);
    console.log('Almacén cargado correctamente:', almacen);
});

// Manejar la conexión del cliente
io.on('connection', (socket) => {

    socket.on('pago', (message) => {
        console.log('Pago:', message);
        pago = true;
        vibrarCliente();
    });

    socket.on('listo', (message) => {
        console.log('Listo:', message);
        listo = true;
        vibrarCliente();
    });


    socket.on('producto-anadir', (product) => {
        console.log(typeof product);
        const producto = almacen.find(item => item.nombre === product);

        if (producto) {
            // Si se encontró el producto, enviar toda su información de vuelta al cliente
            //socket.emit('producto-encontrado', producto);
            console.log('Producto enviado al cliente:', producto);
            socket.emit('producto-micro-encontrado', producto);
        } else {
            // Si no se encuentra el producto, enviar un mensaje de error al cliente
            //socket.emit('producto-no-encontrado', `No se encontró ningún producto con el ID: ${id}`);
            console.log('Producto no encontrado para el ID:', product);
        }
    });
    socket.on('id', (product) => {
        console.log(typeof product);
        const producto = almacen.find(item => item.id == product);

        if (producto) {
            // Si se encontró el producto, enviar toda su información de vuelta al cliente
            //socket.emit('producto-encontrado', producto);
            console.log('Producto enviado al cliente:', producto);
            socket.emit('producto-encontrado', producto);
        } else {
            // Si no se encuentra el producto, enviar un mensaje de error al cliente
            //socket.emit('producto-no-encontrado', `No se encontró ningún producto con el ID: ${id}`);
            console.log('Producto no encontrado para el ID:', product);
        }
    });
    socket.on('lista-nombres', (lista) => {
        // Leer el archivo tasks.json
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo tasks.json:', err);
                // Enviar una respuesta al cliente indicando el error
                socket.emit('respuesta-servidor', 'error');
                return;
            }

            const tasks = JSON.parse(data);
            const tasksOrdenados = [];
            lista.forEach(nombre => {
                const task = tasks.find(t => t.nombre === nombre);
                if (task) {
                    tasksOrdenados.push(task);
                }
            });

            // Escribir el archivo tasks.json con el nuevo orden
            fs.writeFile('tasks.json', JSON.stringify(tasksOrdenados, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Error al escribir el archivo tasks.json:', err);
                    // Enviar una respuesta al cliente indicando el error
                    socket.emit('respuesta-servidor', 'error');
                    return;
                }
                console.log('tasks.json actualizado con éxito');
                fs.readFile('tasks.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    const carritoArray = Array.isArray(carrito) ? carrito : [carrito];

                    console.log("Enviandooo");
                    // Emitir el carrito como un array a través del socket
                    socket.emit('carrito-ordenado', carritoArray);
                });
            });
        });
    });

    socket.on('lista-nombres-fav', (lista) => {
        // Leer el archivo tasks.json
        fs.readFile('favoritos.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo tasks.json:', err);
                // Enviar una respuesta al cliente indicando el error
                socket.emit('respuesta-servidor', 'error');
                return;
            }

            const tasks = JSON.parse(data);
            const tasksOrdenados = [];
            lista.forEach(nombre => {
                const task = tasks.find(t => t.nombre === nombre);
                if (task) {
                    tasksOrdenados.push(task);
                }
            });

            // Escribir el archivo tasks.json con el nuevo orden
            fs.writeFile('favoritos.json', JSON.stringify(tasksOrdenados, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Error al escribir el archivo tasks.json:', err);
                    // Enviar una respuesta al cliente indicando el error
                    socket.emit('respuesta-servidor', 'error');
                    return;
                }
                fs.readFile('favoritos.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    const carritoArray = Array.isArray(carrito) ? carrito : [carrito];

                    console.log("Enviandooo");
                    // Emitir el carrito como un array a través del socket
                    socket.emit('carrito-ordenado-fav', carritoArray);
                });
            });
        });
    });

    socket.on('favorito', (favorito) => {
        const producto = almacen.find(item => item.nombre === favorito);
        if (producto) {
            // Si se encontró el producto, enviar toda su información de vuelta al cliente
            //socket.emit('producto-encontrado', producto);
            console.log('Producto enviado al cliente:', producto);
            socket.emit('favorito-producto', producto);
        } else {
            // Si no se encuentra el producto, enviar un mensaje de error al cliente
            //socket.emit('producto-no-encontrado', `No se encontró ningún producto con el ID: ${id}`);
            console.log('Producto no encontrado para el ID:', product);
        }
    });


    socket.on('producto-plano', (product) => {
        console.log(typeof product);
        const producto = almacen.find(item => item.nombre === product);

        if (producto) {
            // Si se encontró el producto, enviar toda su información de vuelta al cliente
            //socket.emit('producto-encontrado', producto);
            console.log('Producto enviado al cliente:', producto);
            socket.emit('producto-plano-encontrado', producto);
        } else {
            // Si no se encuentra el producto, enviar un mensaje de error al cliente
            //socket.emit('producto-no-encontrado', `No se encontró ningún producto con el ID: ${id}`);
            console.log('Producto no encontrado para el ID:', product);
        }
    });
    socket.on('eliminar-carrito', (nombreProducto) => {
        // Leer el contenido actual del archivo tasks.json
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let carritoExistente = [];
            if (data) {
                carritoExistente = JSON.parse(data);
            }

            // Buscar el producto en el carrito por su nombre
            const productoIndex = carritoExistente.findIndex(producto => producto.nombre === nombreProducto);
            if (productoIndex !== -1) {
                // Si la cantidad del producto es mayor que 1, restar 1 a la cantidad
                if (carritoExistente[productoIndex].cantidad > 1) {
                    carritoExistente[productoIndex].cantidad--;
                } else {
                    // Si la cantidad del producto es igual a 1, eliminar el producto del carrito
                    carritoExistente.splice(productoIndex, 1);
                }
            }

            console.log('Carrito actualizado:', carritoExistente);

            // Guardar el contenido del carrito actualizado en el archivo tasks.json
            fs.writeFile('tasks.json', JSON.stringify(carritoExistente), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                fs.readFile('tasks.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    const carritoArray = Array.isArray(carrito) ? carrito : [carrito];

                    console.log("Enviandooo");
                    // Emitir el carrito como un array a través del socket
                    socket.emit('producto-eliminado', carritoArray);
                });
            });
        });
    });

    socket.on('fav-carritoeliminar', (nombreProducto) => {
        // Leer el contenido actual del archivo tasks.json
        fs.readFile('favoritos.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let carritoExistente = [];
            if (data) {
                carritoExistente = JSON.parse(data);
            }

            // Buscar el producto en el carrito por su nombre
            const productoIndex = carritoExistente.findIndex(producto => producto.nombre === nombreProducto);
            if (productoIndex !== -1) {
                // Si la cantidad del producto es igual a 1, eliminar el producto del carrito
                carritoExistente.splice(productoIndex, 1);
            }

            console.log('Carrito actualizado:', carritoExistente);

            // Guardar el contenido del carrito actualizado en el archivo tasks.json
            fs.writeFile('favoritos.json', JSON.stringify(carritoExistente), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                fs.readFile('favoritos.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    const carritoArray = Array.isArray(carrito) ? carrito : [carrito];

                    console.log("Enviandooo");
                    // Emitir el carrito como un array a través del socket
                    socket.emit('fav-eliminado', carritoArray);
                });
            });
        });
    });

    socket.on('anadir-cantidad', (nombre) => {
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let carritoExistente = [];
            if (data) {
                carritoExistente = JSON.parse(data);
            }

            // Buscar el producto en el carrito por su nombre
            const productoIndex = carritoExistente.findIndex(producto => producto.nombre === nombre);
            if (productoIndex !== -1) {
                if (carritoExistente[productoIndex].cantidad >= 1) {
                    carritoExistente[productoIndex].cantidad++;
                }
            }
            fs.writeFile('tasks.json', JSON.stringify(carritoExistente), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                fs.readFile('tasks.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    const carritoArray = Array.isArray(carrito) ? carrito : [carrito];

                    console.log("Enviandooo");
                    // Emitir el carrito como un array a través del socket
                    socket.emit('producto-masuno', carritoArray);
                });
            });
        });
    });
    socket.on('favoritos-anadir-producto', (nuevoCarrito) => {
        // Leer el contenido actual del archivo tasks.json
        console.log("holaaa");
        console.log(nuevoCarrito);
        fs.readFile('favoritos.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let carritoExistente = [];
            if (data) {
                carritoExistente = JSON.parse(data);
            }
            console.log((carritoExistente.length));
            // Verificar si el carrito existente está vacío
            if (!carritoExistente.length || carritoExistente.length === 0) {
                console.log(carritoExistente.length);
                nuevoCarrito.cantidad = 1;
                // Si el carrito está vacío, crear una lista con el nuevo producto
                carritoExistente = [nuevoCarrito];
            } else {
                // Buscar si existe un producto con el mismo título en el carrito
                const productoExistenteIndex = carritoExistente.findIndex(producto => producto.nombre === nuevoCarrito.nombre);
                if (productoExistenteIndex !== -1) {
                    // Si ya existe un producto con el mismo título, aumentar su cantidad en 1
                    carritoExistente[productoExistenteIndex].cantidad++;
                } else {
                    // Si no existe un producto con el mismo título, agregar el nuevo producto al carrito
                    nuevoCarrito.cantidad = 1;
                    carritoExistente.push(nuevoCarrito);
                }
            }
            console.log('Carrito actualizado favvvv:', carritoExistente);
            // Guardar el contenido del carrito actualizado en el archivo tasks.json
            fs.writeFile('favoritos.json', JSON.stringify(carritoExistente), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // Leer el contenido del archivo tasks.json y enviarlo a través del socket
                fs.readFile('favoritos.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    console.log("Enviandooo favvvv");
                    // Enviar el contenido del carrito a través del socket
                    socket.emit('favoritos-carrito', carrito);
                });
            });
        });
    });


    socket.on('guardar-carrito', (nuevoCarrito) => {
        // Leer el contenido actual del archivo tasks.json
        console.log("holaaa");
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let carritoExistente = [];
            if (data) {
                carritoExistente = JSON.parse(data);
            }
            console.log((carritoExistente.length));
            // Verificar si el carrito existente está vacío
            if (!carritoExistente.length || carritoExistente.length === 0) {
                console.log(carritoExistente.length);
                nuevoCarrito.cantidad = 1;
                // Si el carrito está vacío, crear una lista con el nuevo producto
                carritoExistente = [nuevoCarrito];
            } else {
                // Buscar si existe un producto con el mismo título en el carrito
                const productoExistenteIndex = carritoExistente.findIndex(producto => producto.nombre === nuevoCarrito.nombre);
                if (productoExistenteIndex !== -1) {
                    // Si ya existe un producto con el mismo título, aumentar su cantidad en 1
                    carritoExistente[productoExistenteIndex].cantidad++;
                } else {
                    // Si no existe un producto con el mismo título, agregar el nuevo producto al carrito
                    nuevoCarrito.cantidad = 1;
                    carritoExistente.push(nuevoCarrito);
                }
            }
            console.log('Carrito actualizado:', carritoExistente);
            // Guardar el contenido del carrito actualizado en el archivo tasks.json
            fs.writeFile('tasks.json', JSON.stringify(carritoExistente), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // Leer el contenido del archivo tasks.json y enviarlo a través del socket
                fs.readFile('tasks.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsear el contenido del archivo JSON
                    const carrito = JSON.parse(data);
                    console.log("Enviandooo");
                    // Enviar el contenido del carrito a través del socket
                    socket.emit('producto-carrito', carrito);
                });
            });
        });
    });



    socket.on('carrito-almacen', () => {
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            let carrito_dep = JSON.parse(data);
    
            // Enviar el carrito
            console.log("Enviandooo");
            socket.emit('carrito-recivido', carrito_dep);

        });

       });     
        socket.on('nfcWritten', function (message) {
            console.log(message);
        });


        socket.on('nfcRead', function (data) {
            console.log('Datos leídos de la tarjeta NFC:', data);
        });

        socket.on('nfcError', function (error) {
            console.error(error);
        });

    });

    app.use(express.static('www'));
    server.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'));
