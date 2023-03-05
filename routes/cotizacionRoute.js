import express from 'express'
import { obtenerCotizaciones, 
         crearCotizacion, 
         obtenerCotizacionById,
         editarCotizacion } from '../controllers/cotizacionController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
    .get(checkAuth, obtenerCotizaciones)
    .post(checkAuth, crearCotizacion)

router.route('/:id')
    .get(checkAuth, obtenerCotizacionById)
    .post(checkAuth, editarCotizacion)
    .put(checkAuth, editarCotizacion)

export default router