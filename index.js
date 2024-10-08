const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const findElementById = require("./funcionalidades")
const userController = require('./src/controllers/userController')
const BDDController = require('./src/controllers/BDController')

app.use(express.json())
app.use(
  cors({
    origin: "*",
  })
)


app.get("/", (req, res) => {
  res.send("¡Hola, Mundo!")
})
/* ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ */

let dataCache = null // Variable para almacenar los datos

const loadData = () => {
  return new Promise((resolve, reject) => {
    const directorio = "./media/"
    fs.readdir(directorio, (err, archivos) => {
      if (err) {
        console.error("Error en lectura de carpeta: ", err)
        return reject("Error al leer carpeta")
      }

      let id = 0
      const promesasDeLectura = archivos.map((archivo) => {
        return new Promise((resolve, reject) => {
          fs.readdir(path.join(directorio, archivo), (err, archivosImgs) => {
            if (err) {
              console.error("Error al leer la carpeta:", err)
              return reject(err)
            }
            const arrayUrlsImgs = archivosImgs.map((nombreImagen) => {
              id++
              let separacionDePartes = nombreImagen.split("_")
              let texto_español = separacionDePartes[1]?.split(".")[0]
              let texto_ingles = separacionDePartes[0]
              return {
                id: id,
                url: `https://e-b-js-traduciones.onrender.com/media/${archivo}/${nombreImagen}`,
                ing: `${
                  texto_ingles.charAt(0).toUpperCase() +
                  texto_ingles.slice(1).replace(/\.[^.]+$/, "")
                }`,
                esp: `${
                  texto_español?.charAt(0).toUpperCase() +
                  texto_español?.slice(1).replace(/\.[^.]+$/, "")
                }`,
                activo: false,
              }
            })
            resolve({ [archivo]: arrayUrlsImgs })
          })
        })
      })

      Promise.all(promesasDeLectura)
        .then((objetos) => {
          const objetoReturn = objetos.reduce((resultado, objeto) => {
            return { ...resultado, ...objeto }
          }, {})
          resolve(objetoReturn)
        })
        .catch((error) => {
          console.error("Error general:", error)
          reject("Error interno del servidor")
        })
    })
  })
}

const initializeData = async () => {
  try {
    dataCache = await loadData()
    console.log("Datos cargados con éxito")
  } catch (error) {
    console.error("Error al cargar datos:", error)
  }
}

initializeData()

/* RETORNA OBJETO CON TODAS LAS RUTAS DE IMAGENES TRADUCCIONES EN ESPAÑOL E INGLES DE LO QUE SE REPRESENTA */
app.get("/data-elements", (req, res) => {
  if (dataCache) {
    res.json(dataCache)
  } else {
    res.status(500).send("Datos no disponibles")
  }
})

/* Buscar por ID */
app.get("/element/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const element = findElementById(dataCache, id)

  if (element) {
    res.json(element)
  } else {
    res.status(404).send("Elemento no encontrado")
  }
})

/* Devuelve keywords (Categorias) */
app.get("/categories/keys", (req, res) => {
  const keywords = Object.keys(dataCache)
  console.log(keywords)
  res.json(keywords)
})

app.get("/media/:categoria/:imageName", (req, res) => {
  const imageName = req.params.imageName // Obtiene el valor del parámetro de ruta
  const categoria = req.params.categoria
  const imagePath = path.join(__dirname, `/media/${categoria}/${imageName}`) // RUTA API
  res.sendFile(imagePath) // Envía el archivo de imagen al cliente
})

app.get("/completed", (req, res) => {
  const imagePath = path.join(__dirname, `./completed.jpg`) // RUTA API
  res.sendFile(imagePath)
})


/* ---------------------------------------------------------------- */
/* ---------------------------------------------------------------- */
/* ---------------------------------------------------------------- */
/* ---------------------------------------------------------------- */

// Crear la conexión a la base de datos

const db = require('./src/models/db')
// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err)
    return
  }
  console.log("Conectado a la base de datos MySQL en localhost:3006")
})

// Crear una ruta simple para probar la conexión
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send("Error en la consulta a la base de datos")
      return
    }
    res.json(results)
  })
})

// Rutas
app.post('/register', userController.register)
app.post('/login', userController.login)
app.get('/users-data', userController.getUsers)
app.put('/upl-points', userController.uploadPointsUser)
app.get("/pingBDD",BDDController.verifyBDD)





app.get("/ping", (req, res) => {
  res.status(200).send("pong traducc")
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
