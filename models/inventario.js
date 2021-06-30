const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  insumo: { type: String, required: true },
  stock: { type: Number, required: true },
  entradas: { type: Number, required: true },
  salidas: { type: Number, required: false },
});

InventarioSchema.virtual('url').get(function getUrl() {
  return `/inventario/${this._id}`;
});


module.exports = mongoose.model('InventarioSchema', InventarioSchema);
