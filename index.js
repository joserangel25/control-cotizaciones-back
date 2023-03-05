import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoute.js'
import cotizacionesRoute from './routes/cotizacionRoute.js'
import interaccionesRoutes from './routes/interaccionesRoutes.js'

const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

//Configurando CORS
const corsOptions = {
  origin: [process.env.URL_FRONTED]
}

app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/cotizaciones', cotizacionesRoute)
app.use('/api/interacciones', interaccionesRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log('servidor corriendo en el puerto ' + PORT)
})