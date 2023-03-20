import Usuario from "../models/Usuario.js";
import Agencia from "../models/Agencia.js";


const obtenerAgencias = async (req, res) => {
  const { _id } = req.usuario

  //Validar que el usuario que hace la peticion tenga el rol de Admin
  const usuarioEncontrado = await Usuario.findById(_id)
  if(!usuarioEncontrado || usuarioEncontrado.rol !== 'admin'){
    const error = new Error('El usuario que solicita no existe o no tiene permisos')
    return res.status(404).json({ msg: error.message });
  }

  try {
    const agencias = await Agencia.find().select('-createdAt -updatedAt -colaboradores -__v');
    res.json(agencias)
  } catch (error) {
    console.log(error)
  }
};

const obtenerAgenciaById = async (req, res) => {
  const { _id } = req.usuario
  const params = req.params

  //Validar que el usuario que hace la peticion tenga el rol de Admin
  const usuarioEncontrado = await Usuario.findById(_id)
  if(!usuarioEncontrado || usuarioEncontrado.rol !== 'admin'){
    const error = new Error('El usuario que solicita no existe o no tiene permisos')
    return res.status(404).json({ msg: error.message });
  }

  try {
    const agenciaEncontrada = await Agencia.findById(params.id).select('-createdAt -updatedAt -__v')
    .populate('colaboradores','cotizaciones nombre email rol')
    .populate({path: 'cotizaciones', select: '-createdAt -updatedAt -__v', populate: { path: 'creador', select: '_id nombre email identificacion' } })
    res.json(agenciaEncontrada)
  } catch (error) {
    console.log(error)
  }
};

const crearAgencia = async (req, res) => {
  const { _id } = req.usuario

  //Validar que el usuario que hace la peticion tenga el rol de Admin
  const usuarioEncontrado = await Usuario.findById(_id)
  if(!usuarioEncontrado || usuarioEncontrado.rol !== 'admin'){
    const error = new Error('El usuario que solicita no existe o no tiene permisos')
    return res.status(404).json({ msg: error.message })
  }
  //Crear la agencia
  try {
    const agenciaNueva = await Agencia.create(req.body)
    res.json(agenciaNueva)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ msg: 'Se presentó un error en la solicitud. Validar con el administrador del servicio' })
  }
  
};

const editarAgencia = async (req, res) => {
  const { _id } = req.usuario
  const params = req.params

  //Validar que el usuario que hace la peticion tenga el rol de Admin
  const usuarioEncontrado = await Usuario.findById(_id)
  if(!usuarioEncontrado || usuarioEncontrado.rol !== 'admin'){
    const error = new Error('El usuario que solicita no existe o no tiene permisos')
    return res.status(404).json({ msg: error.message });
  }

  const agenciaEncontrada = await Agencia.findById(params.id).select('-createdAt -updatedAt -__v');
  if(!agenciaEncontrada){
    const error = new Error('Error, la agencia no existe. Validar con el administrador.')
    return res.status(404).json({ msg: error.message });
  }

  try {
    agenciaEncontrada.nombre = req.body.nombre || agenciaEncontrada.nombre;
    agenciaEncontrada.identificacion = req.body.identificacion || agenciaEncontrada.identificacion;
    const agenciaAlmacenada = await agenciaEncontrada.save()
    res.json(agenciaAlmacenada)
  } catch (error) {
    console.log(error)
  }
}

const eliminarAgencia = async (req, res) => {
  const { _id } = req.usuario
  const params = req.params
  try {
  //Validar que el usuario que hace la peticion tenga el rol de Admin
  const usuarioEncontrado = await Usuario.findById(_id)
  if(!usuarioEncontrado || usuarioEncontrado.rol !== 'admin'){
    const error = new Error('El usuario que solicita no existe o no tiene permisos')
    return res.status(404).json({ msg: error.message });
  }

  const agenciaEncontrada = await Agencia.findOne({_id: params.id}).select('-createdAt -updatedAt -__v');
  if(!agenciaEncontrada){
    const error = new Error('Error, la agencia no existe. Validar con el administrador.')
    return res.status(404).json({ msg: error.message });
  }

  
    await agenciaEncontrada.deleteOne()
    res.json({msg: 'La agencia se eliminó satisfactoriamente.'})
  } catch (error) {
    console.log(error)
    res.status(404).json({ msg: 'Hubo un error. Validar con el administrador del servicio.' })
  }
}

//Colaboradores
const agregarColaborador = async (req, res) => {
  console.log(req.body)
  const params = req.params
  const { usuario } = req;
  const { id } = req.body;

  //Se valida que exista la agencia a la cual se pretende agregar un colaborador
  const agenciaEncotrada = await Agencia.findById(params.id);
  if(!agenciaEncotrada){
    const error = new Error('La agencia no existe. Por favor crearla primero.')
    return res.status(404).json({ msg: error.message })
  }

  //Se valida que exiista el colaborador que se pretende agregar
  const usuarioAgregar = await Usuario.findById(id);
  if(!usuarioAgregar){
    const error = new Error('El usuario no existe.')
    return res.status(404).json({ msg: error.message })
  }

  //Validar que quien hace la solicitud de inclusion sea un usuario administrador
  const administrador = await Usuario.findById(usuario._id);
  if(!administrador || administrador.rol !== 'admin'){
    const error = new Error('El usuario que hace la petición no existe o no tiene permisos.')
    return res.status(404).json({ msg: error.message })
  }
  
  //Validar que ya no esté incluido el colaborar que se pretende incluir
  if(agenciaEncotrada.colaboradores.includes(usuarioAgregar._id)){
    const error = new Error('El usuario ya pertenece a la agencia.')
    return res.status(403).json({ msg: error.message })
  }

  try {
    agenciaEncotrada.colaboradores.push(usuarioAgregar._id)
    agenciaEncotrada.cotizaciones.push(...usuarioAgregar.cotizaciones)
    await agenciaEncotrada.save()
    res.json({msg: 'El colaborador fue agregado exitosamente'})
  } catch (error) {
    console.log(error)
  }
}

const eliminararColaborador = async (req, res) => {
  const params = req.params
  const { usuario } = req; //Usuario administrador que hace la petición
  const { id } = req.body; //Usuario que se va a eliminar de la agencia

  //Se valida que exista la agencia a la cual se pretende agregar un colaborador
  const agenciaEncotrada = await Agencia.findById(params.id).populate('cotizaciones', 'creador _id placa');
  if(!agenciaEncotrada){
    const error = new Error('La agencia no existe. Por favor crearla primero.')
    return res.status(404).json({ msg: error.message })
  }

  //Se valida que exiista el colaborador que se pretende agregar
  const usuarioEliminar = await Usuario.findById(id);
  if(!usuarioEliminar){
    const error = new Error('El usuario no existe.')
    return res.status(404).json({ msg: error.message })
  }

  //Validar que quien hace la solicitud de inclusion sea un usuario administrador
  const administrador = await Usuario.findById(usuario._id);
  if(!administrador || administrador.rol !== 'admin'){
    const error = new Error('El usuario que hace la petición no existe o no tiene permisos.')
    return res.status(404).json({ msg: error.message })
  }
  
  //Validar que no esté incluido el colaborar que se pretende eliiminar
  if(!agenciaEncotrada.colaboradores.includes(usuarioEliminar._id)){
    const error = new Error('El usuario no pertenece a la agencia y no se pude eliminar.')
    return res.status(403).json({ msg: error.message })
  }
  console.log('agencia actual', agenciaEncotrada)

  try {
    const newCotizacionesAgencia = agenciaEncotrada.cotizaciones.filter(coti => coti.creador.toString() !== usuarioEliminar._id.toString());
    agenciaEncotrada.cotizaciones = newCotizacionesAgencia;
    agenciaEncotrada.colaboradores.pull(usuarioEliminar._id)
    await agenciaEncotrada.save()
    console.log('agencia modificada', agenciaEncotrada)

    res.json({msg: 'El colaborador fue eliminado exitosamente'})
  } catch (error) {
    console.log(error)
  }
}

export {
  obtenerAgencias,
  obtenerAgenciaById,
  crearAgencia,
  editarAgencia,
  eliminarAgencia,
  agregarColaborador,
  eliminararColaborador
}