const mongoose = require('mongoose');

const EntradasSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  insumo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventarioSchema',
    required: true,
  },
  cantidad: { type: Number, required: true },
});

EntradasSchema.virtual('url').get(function getUrl() {
  return `/entradas/${this._id}`;
});

module.exports = mongoose.model('entradasSchema', EntradasSchema);
