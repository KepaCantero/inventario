const mongoose = require('mongoose');

const SalidasSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  receta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecetaSchema',
    required: true,
  },
  cantidad: { type: Number, required: true },
});

SalidasSchema.virtual('url').get(function getUrl() {
  return `/salidas/${this._id}`;
});

module.exports = mongoose.model('salidasSchema', SalidasSchema);
