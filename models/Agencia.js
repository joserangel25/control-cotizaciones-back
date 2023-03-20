import mongoose from "mongoose";

const agenciaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  identificacion: {
    type: Number,
    required: true,
    trim: true
  },
  colaboradores: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Usuario',
      default: []
    }
  ],
  cotizaciones: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Cotizacion',
      default: []
    }
  ]
},{
  timestamps: true
})

const Agencia = mongoose.model('Agencia', agenciaSchema);
export default Agencia