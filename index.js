const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

/* RETORNA OBJETO CON TODAS LAS RUTAS DE IMAGENES TRADUCCIONES EN ESPAÑOL E INGLES DE LO QUE SE REPRESENTA */
app.get('/data-elements', (req, res) => {

    const directorio = './media/'

    fs.readdir(directorio, (err, archivos) => {

        if (err) {
            console.error("Error en lectura de carpeta: ", err)
            return res.status(500).send('Error al leer carpeta')
        }
        let id = 0

        const promesasDeLectura = archivos.map(archivo => {
            return new Promise((resolve, reject) => {

                fs.readdir(path.join(directorio, archivo), (err, archivosImgs) => {
                    if (err) {
                        console.error('Error al leer la carpeta:', err);
                        return reject(err);
                    }
                    const arrayUrlsImgs = archivosImgs.map(nombreImagen => {
                        id++
                        let separacionDePartes = nombreImagen.split('_')
                        let texto_español = separacionDePartes[1].split('.')[0] 
                        let texto_ingles = separacionDePartes[0]
                        return (
                            {
                                id: id,
                                url: `/media/${archivo}/${nombreImagen}`,
                                /* CONVIERTE PRIMER LETRA EN MAYUSCULAS, Y ELIMINA EXTENSION, TOMANDO EL NOMBRE DE LA IMAGEN COMO NOMBRE PRINCIPAL */
                                ing:`${texto_ingles.charAt(0).toUpperCase() + texto_ingles.slice(1).replace(/\.[^.]+$/, '')}`,
                                esp: `${texto_español.charAt(0).toUpperCase() + texto_español.slice(1).replace(/\.[^.]+$/, '')}`,
                                activo:false
                            }
                        )

                    })

                    resolve({ [archivo]: arrayUrlsImgs })
                })
            })
        })
        // Esperar a que todas las promesas de lectura se resuelvan
        Promise.all(promesasDeLectura)
            .then(objetos => {
                // Construir el objetoReturn una vez que todas las promesas se hayan resuelto
                const objetoReturn = objetos.reduce((resultado, objeto) => {
                    return { ...resultado, ...objeto }
                }, {})

                console.log(objetoReturn)
                res.json(objetoReturn)
            })
            .catch(error => {
                console.error('Error general:', error)
                res.status(500).send('Error interno del servidor')
            })

    })
})

app.get('/media/:categoria/:imageName', (req, res) => {
    const imageName = req.params.imageName; // Obtiene el valor del parámetro de ruta
    const categoria = req.params.categoria
    const imagePath = path.join(__dirname, `/media/${categoria}/${imageName}`); // RUTA API
    res.sendFile(imagePath); // Envía el archivo de imagen al cliente
})

app.get('/completed', (req, res)=>{
    const imagePath = path.join(__dirname, `./completed.jpg`); // RUTA API
    res.sendFile(imagePath)
})


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
