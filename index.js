import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoute.js'
import cotizacionesRoute from './routes/cotizacionRoute.js'
import interaccionesRoutes from './routes/interaccionesRoutes.js'
import agenciaRoutes from './routes/agenciaRoutes.js'

const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

/**** Set Cors ****/
const app_corsWhiteList = process.env.APP_CORSWHITELIST.split(", ");

const allowlist = app_corsWhiteList;
const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}
app.use(cors(corsOptionsDelegate))

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/cotizaciones', cotizacionesRoute)
app.use('/api/interacciones', interaccionesRoutes)
app.use('/api/agencias', agenciaRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log('servidor corriendo en el puerto ' + PORT)
})