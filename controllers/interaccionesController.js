import Cotizacion from "../models/Cotizacion.js";
import Interaccion from "../models/Interaccion.js";

const crearInteraccion = async (req, res) => {
  const { cotizacion } = req.body;

  const cotizacionEncontrada = await Cotizacion.findById(cotizacion)

  //Comprobamos que la cotizacion exista en la base de datos
  if(!cotizacionEncontrada){
    const error = new Error('La cotización no existe. Acción inválida');
    return res.status(404).json({msg: error.message})
  }

  //Comprobamos que quien agrega la interacción sea el creador de la cotización
  if(cotizacionEncontrada.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('No tienes permiso para agregar esta interacción.');
    return res.status(401).json({msg: error.message})
  }

  try {
 
    const interaccionAlmacenada = await Interaccion.create(req.body)
    res.json(interaccionAlmacenada)

  } catch (error) {
    console.log(error)
  }
}

export {
  crearInteraccion
}