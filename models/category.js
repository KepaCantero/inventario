const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  donut: { type: Boolean, required: true },
  imageFilename: { type: String, required: false },
});

CategorySchema.virtual('url').get(function getUrl() {
  return `/inventory/categories/${this._id}`;
});

CategorySchema.virtual('imageUrl').get(function getImageUrl() {
  if (this.imageFilename) {
    return `/images/categories/${this.imageFilename}`;
  }
  return '/images/categories/default.jpg';
});

module.exports = mongoose.model('Category', CategorySchema);
