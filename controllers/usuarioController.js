import Usuario from "../models/Usuario.js"
import { generarJwt } from "../helpers/generarJWT.js";
import { generarToken } from "../helpers/generarToken.js";

const registrarUsuario = async (req, res) => {
  //Validar ssi un usuario ya está registrado

  const { email } = req.body
  const existeUsuario = await Usuario.findOne({ email })
  if(existeUsuario){
    const error = new Error('El correo ya se encuentra registrado')
    return res.status(400).json({ msg: error.message })
  }

  try {
    const usuario = new Usuario(req.body)
    await usuario.save()
    res.json({msg: 'El usuario fue creado exitosamente!'})
  } catch (error) {
    console.log(error)
  }
};

const autenticarUsuario = async (req, res) => {

  const { email, password } = req.body
  //Comprobar si existe el usuario en la base de datos
  const usuario = await Usuario.findOne({email});
  if(!usuario){
    const error= new Error('El usuario no está registrado');
    return res.status(404).json({msg: error.message})
  }

  //Comprobar el password
  if(await usuario.comprobarPassword(password)){
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token: generarJwt(usuario._id)
    })
  } else {
    const error= new Error('El password es incorrecto');
    return res.status(403).json({msg: error.message})
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body
  //Comprobar si existe el usuario en la base de datos
  const usuario = await Usuario.findOne({email});
  if(!usuario){
    const error= new Error('El usuario no está registrado');
    return res.status(404).json({msg: error.message})
  }
  
  try {
    usuario.token = generarToken()
    await usuario.save()
    res.json({ msg: 'Hemos enviado un mail con las instrucciones' })
    
  } catch (error) {
    console.log(error)
  }
};

const comprobarToken  = async (req, res) => {
  const { token } = req.params

  const tokenValido = await Usuario.findOne({token})
  if(!tokenValido){
    const error= new Error('El token no es válido');
    return res.status(404).json({msg: error.message})
  } else {
    res.json({msg: 'El token es válido y el usuario existe'})
  }
};

const restablecerPassword  = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;


  const usuario = await Usuario.findOne({token})
  if(!usuario){
    const error= new Error('El token no es válido');
    return res.status(404).json({msg: error.message})
  } else {
    usuario.password = password;
    usuario.token = ''
    try {
      await usuario.save()
      res.json({msg: 'Contraseña actualiaza correctamente'})
    } catch (error) {
      console.log(error)
    }
  }

};


const obtenerPerfil = async (req, res) => {
  const { usuario } = req
  res.json(usuario) 
};

const buscarUsuario = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({email}).select('-createdAt -identificacion -password -token -updatedAt -__v -email');
  if(!usuario){
    const error= new Error('El usuario no está registrado');
    return res.status(404).json({msg: error.message})
  }

  res.json(usuario)
}

export {
  registrarUsuario,
  autenticarUsuario,
  olvidePassword,
  restablecerPassword,
  comprobarToken,
  obtenerPerfil,
  buscarUsuario
}