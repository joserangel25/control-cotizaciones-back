import Cotizacion from '../models/Cotizacion.js'
import Interaccion from '../models/Interaccion.js';
import Usuario from '../models/Usuario.js';

const obtenerCotizaciones = async (req, res) => {

  const { _id } = req.usuario
  try {
    // const cotizaciones = await Cotizacion.find({ creador: _id })
    const cotizaciones = await Cotizacion.find().where('creador').equals(req.usuario)
    res.json(cotizaciones)
  } catch (error) {
    console.log(error);
  }
}

const crearCotizacion = async (req, res) => {
  const { _id } = req.usuario;

  try {
    const usuarioEncontrado = await Usuario.findOne(_id);
    
    //Creamos y guardamos la cotización en la DB
    const cotizacion = new Cotizacion(req.body)
    cotizacion.creador = req.usuario._id
    const cotizacionAlmacenada = await cotizacion.save();

    //Incluimos el ID de la cotizacion guardada en el usuario que la creó
    usuarioEncontrado.cotizaciones.push(cotizacionAlmacenada._id)
    await usuarioEncontrado.save()

    res.json(cotizacionAlmacenada)
  } catch (error) {
    console.log(error);
  }
}

const obtenerCotizacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const cotizacion = await Cotizacion.findById(id)
    
    if(!cotizacion){
      const error = new Error('No existe cotización.')
      return res.status(404).json(error.message)
    }

    if(cotizacion.creador.toString() !== req.usuario._id.toString()){
      const error = new Error('No tienes permisos para ver esta cotizacion')
      return res.status(401).json({msg: error.message})
    }

    //Consultamos las interacciones que tenga esta cotización en particulart y se devuelven en la respuesta
    const interacciones = await Interaccion.find().where('cotizacion').equals(cotizacion._id) 

    res.json({cotizacion, interacciones})
    
  } catch (error) {
    console.log(error)
  }
}

const editarCotizacion = async (req, res) => {
  const { id } = req.params;
  try {
    const cotizacion = await Cotizacion.findById(id)
    
    if(!cotizacion){
      const error = new Error('No existe cotización.')
      return res.status(404).json(error.message)
    }

    if(cotizacion.creador.toString() !== req.usuario._id.toString()){
      const error = new Error('No tienes permisos para ver esta cotizacion')
      return res.status(401).json({msg: error.message})
    }

    cotizacion.cliente = req.body.cliente || cotizacion.cliente;
    cotizacion.estado = req.body.estado || cotizacion.estado;
    cotizacion.observaciones = req.body.observaciones || cotizacion.observaciones;
    cotizacion.mejorAseguradora = req.body.mejorAseguradora || cotizacion.mejorAseguradora;
    cotizacion.prima = req.body.prima || cotizacion.prima;
    cotizacion.placa = req.body.placa || cotizacion.placa;
    cotizacion.interacciones = req.body.interacciones || cotizacion.interacciones;

    const cotizacionActualizada = await cotizacion.save()
    res.json(cotizacionActualizada)
    
  } catch (error) {
    console.log(error)
  }
}


export {
  obtenerCotizacionById,
  obtenerCotizaciones,
  crearCotizacion,
  editarCotizacion
}