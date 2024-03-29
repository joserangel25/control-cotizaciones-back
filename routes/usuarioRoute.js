import express from 'express'
import {  registrarUsuario, 
          autenticarUsuario, 
          olvidePassword, 
          restablecerPassword, 
          comprobarToken,
          obtenerPerfil,
          buscarUsuario } from '../controllers/usuarioController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', registrarUsuario)
router.post('/login', autenticarUsuario)
router.post('/olvide-password', olvidePassword)
router.route('/olvide-password/:token')
      .get(comprobarToken)
      .post(restablecerPassword)

router.post('/buscar-usuario', checkAuth, buscarUsuario)

router.get('/perfil', checkAuth, obtenerPerfil)


export default router