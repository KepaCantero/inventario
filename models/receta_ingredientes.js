const mongoose = require('mongoose');

const RecetaIngredientesSchema = new mongoose.Schema({
  receta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecetaSchema',
    required: true,
  },
  medida_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnidadesSchema',
    required: true,
  },
  qty: { type: Number, required: true },
  ingrediente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventarioSchema',
    required: true,
  },
});

RecetaIngredientesSchema.virtual('url').get(function getUrl() {
  return `/receta_ingredientes/${this._id}`;
});


module.exports = mongoose.model('RecetaIngredientesSchema', RecetaIngredientesSchema);
