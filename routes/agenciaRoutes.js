import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {  obtenerAgencias,
          agregarColaborador, 
          crearAgencia, 
          editarAgencia,
          eliminarAgencia,
          eliminararColaborador, 
          obtenerAgenciaById} from "../controllers/agenciasController.js";

const router = express.Router();

router.route('/')
      .get(checkAuth, obtenerAgencias)
      .post(checkAuth, crearAgencia)


router.route('/:id')
      .get(checkAuth, obtenerAgenciaById)
      .post(checkAuth, editarAgencia)
      .delete(checkAuth, eliminarAgencia)


router.route('/:id/colaborador')
      .post(checkAuth, agregarColaborador)
      .patch(checkAuth, eliminararColaborador)

export default router