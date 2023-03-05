import mongoose from "mongoose";

const interaccionSchema = mongoose.Schema({
  fecha : {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  cotizacion: {
    type: mongoose.Types.ObjectId,
    ref: 'Cotizacion',
    required: true,
  }
}, {
  timestamps: true
})

const Interaccion = mongoose.model('Interaccion', interaccionSchema);
export default Interaccion