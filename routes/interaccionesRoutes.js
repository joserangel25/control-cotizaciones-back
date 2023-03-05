import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { crearInteraccion } from '../controllers/interaccionesController.js';

const router = express.Router();

router.post('/', checkAuth, crearInteraccion)


export default router