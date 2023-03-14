import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  identificacion: {
    type: Number,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  rol: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    default: ''
  },
  cotizaciones: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Cotizacion',
      default: []
    }
  ]
},
{
  timestamps: true
});
usuarioSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)

});

usuarioSchema.methods.comprobarPassword = async function(passwordForm){
  return await bcrypt.compare(passwordForm, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario