import mongoose from 'mongoose'

const cotizacionSchema = mongoose.Schema({
  cliente: {
    type: String,
    required: true,
    trim: true
  },
  placa: {
    type: String,
    required: true,
    trim: true
  },
  mejorAseguradora: {
    type: String,
    required: true,
    trim: true
  },
  prima: {
    type: Number,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    enum: ['Cotizado', 'Emitido', 'Desistido'],
    default: 'Cotizado'
  },
  fecha: {
    type: Date,
    default: Date.now()
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  observaciones: {
    type: String,
    default: ''
  },
  referido: {
    type: String,
    required: true,
    trim: true
  }
  // interacciones: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: 'Interaccion'
  //   }
  // ]
},
{
  timestamps: true
})

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema)
export default Cotizacion