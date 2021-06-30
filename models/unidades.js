const mongoose = require('mongoose');

const UnidadesSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },

});

module.exports = mongoose.model('UnidadesSchema', UnidadesSchema);
