const { body, validationResult } = require("express-validator");

const RecetaSchema = require("../models/receta");
const InventarioSchema = require("../models/inventario");
const UnidadesSchema = require("../models/unidades");
const RecetaIngredientesSchema = require("../models/receta_ingredientes");
const {ObjectId} = require('mongodb'); // or ObjectID

function DeleteRecetaById(receta_id) {
  return new Promise(function (resolve, reject) {
    RecetaSchema.findByIdAndDelete(
      receta_id,
      function (err, receta_ingrediente) {
        if (err)
          reject(err);
         else
          resolve(receta_id);
      }
    );
  });
}

function DeleteManyIngredientsById(receta_id) {
  return new Promise(function (resolve, reject) {
    RecetaIngredientesSchema.deleteMany(
      { receta_id: receta_id },
      function (err, receta_ingrediente) {
        if (err) reject(err);
        else resolve(receta_id);
      }
    );
  });
}

exports.receta_delete_post = async (req, res) => {
  DeleteRecetaById(req.params.id).then(function (receta_id) {
    DeleteManyIngredientsById(receta_id).then(function (receta_id) {
      res.redirect("/recetas");
    });
  });
};

exports.receta_delete_get = async (req, res) => {
  const receta_ingredientes_item = await RecetaIngredientesSchema.find({
    receta_id: req.params.id,
  })
    .populate("medida_id")
    .populate("ingrediente_id");
  res.render("receta_delete", {
    title: `Delete ${receta_ingredientes_item.nombre}`,
    receta_ingredientes_item,
  });
};

exports.recetas_list = async (req, res) => {
  const recetas_list = await RecetaSchema.find({});
  res.render("recetas_list", { title: "Lista de Recetas", recetas_list });
};

exports.recetas_create_get = async (req, res) => {
  const insumos = await InventarioSchema.find({});
  const unidades = await UnidadesSchema.find({});
  res.render("recetas_form", {
    title: "Añadir nueva Receta",
    insumos,
    unidades,
  });
};

exports.receta_detail = async (req, res) => {
  const receta = await RecetaSchema.findById(req.params.id);
  const receta_ingredientes_item = await RecetaIngredientesSchema.find({
    receta_id: req.params.id,
  })
    .populate("medida_id")
    .populate("ingrediente_id");

  var ingredientes = [];
  receta_ingredientes_item.forEach(function (item) {
    var ingrediente = [];
    console.info("receta detail");
    console.info(item);
    ingrediente.medida = item.medida_id.descripcion;
    ingrediente.cantidad = item.qty;
    ingrediente.nombre = item.ingrediente_id.insumo;
    ingredientes.push(ingrediente);
  });

  res.render("receta_detail", { title: receta.nombre, receta, ingredientes });
};
function saveReceta(req) {
  return new Promise(function (resolve, reject) {
    receta_row = new RecetaSchema();
    receta_row.nombre = req.body.name;
    receta_row.descripcion = req.body.description;
    receta_row.save(function (err, receta) {
      if (err) {
        reject(err);
      } else {
        receta_id = receta._id;
        resolve(receta_id);
      }
    });
  });
}

exports.receta_create_post = [
  async (req, res) => {
    // eslint-disable-next-line object-curly-newline
    let receta_id = await saveReceta(req);
    console.info(req.body.ingrediente);
    for (const index in req.body.ingrediente) {

      var ingrediente_id = req.body.ingrediente[index];
      var qty = req.body.cantidad[index];
      var medida_id = req.body.unidad[index];
      const receta_row = new RecetaIngredientesSchema({
        receta_id,
        medida_id,
        qty,
        ingrediente_id,
      });
      receta_row.save();

    }
    res.redirect("/recetas");
  },
];

exports.receta_update_get = async (req, res) => {
  const receta = await RecetaSchema.findById(req.params.id);
  const receta_ingredientes_item = await RecetaIngredientesSchema.find({
    receta_id: req.params.id,
  })
    .populate("medida_id")
    .populate("ingrediente_id");

  var ingredientes = [];
  receta_ingredientes_item.forEach(function (item) {
    var ingrediente = [];
    ingrediente.medida = item.medida_id.descripcion;
    ingrediente.cantidad = item.qty;
    ingrediente.nombre = item.ingrediente_id.insumo;
    ingredientes.push(ingrediente);
  });
  const insumos = await InventarioSchema.find({});
  const unidades = await UnidadesSchema.find({});
  res.render("recetas_form", {
    title: receta.nombre,
    receta,
    ingredientes,
    insumos,
    unidades,
  });
};
