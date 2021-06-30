const mongoose = require('mongoose');

const RecetaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
});

RecetaSchema.virtual('url').get(function getUrl() {
  return `/recetas/${this._id}`;
});



module.exports = mongoose.model('RecetaSchema', RecetaSchema);
