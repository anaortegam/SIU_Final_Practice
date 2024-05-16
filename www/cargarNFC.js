var socket = io();
let json = {"nombre":"Camisa sdaadasda","imagen":"../imgs/camisa_copia.jpg", };


document.getElementById('write').addEventListener('click', async function() {
    if ('NDEFReader' in window || 'NDEFWriter' in window) {
        const ndef = new NDEFReader();

        try {
            await ndef.write(JSON.stringify(json));
            console.log('Escrito con éxito en la tarjeta NFC');
            socket.emit('nfcWritten', 'Escrito con éxito en la tarjeta NFC');
        } catch (error) {
            console.error('Error al escribir en la tarjeta NFC', error);
            socket.emit('nfcError', 'Error al escribir en la tarjeta NFC');
        }
    } else {
        console.log('La API Web NFC no está soportada en este navegador');
    }
});

document.getElementById('read').addEventListener('click', async function() {
    if ('NDEFReader' in window) {
        const ndef = new NDEFReader();
        try {
            await ndef.scan();
            console.log('Escaneo iniciado exitosamente.');
            ndef.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    console.log('Tipo de registro: ' + record.recordType);
                    console.log('MIME type: ' + record.mediaType);
                    console.log('Datos: ' + decoder.decode(record.data));
                    socket.emit('nfcRead', decoder.decode(record.data));
                }
            };
        } catch (error) {
            console.error('Error al iniciar el escaneo NFC', error);
            socket.emit('nfcError', 'Error al iniciar el escaneo NFC');
        }
    } else {
        console.log('La API Web NFC no está soportada en este navegador');
    }
});