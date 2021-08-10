const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  insumo: { type: String, required: true },
  stock: { type: Number, required: true },
  entradas: { type: Number, required: true },
  salidas: { type: Number, required: true },
  unidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnidadesSchema',
    required: true,
  },
});

InventarioSchema.virtual('url').get(function getUrl() {
  return `/inventario/${this._id}`;
});


module.exports = mongoose.model('InventarioSchema', InventarioSchema);
