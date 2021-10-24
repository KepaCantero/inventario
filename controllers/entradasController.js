const {body, validationResult} = require("express-validator")

const RecetaSchema = require("../models/receta")
const InventarioSchema = require("../models/inventario")
const RecetasSchema = require("../models/receta")
const EntradasSchema = require("../models/entradas")
const RecetaIngredientesSchema = require("../models/receta_ingredientes")

var async = require("async")

exports.entrada_delete_get = async (req, res) => {
  const entrada = EntradasSchema.findById(req.params.id)
    .populate("insumo_id")
    .lean()
    .exec(function (err, entrada) {
      var dateObj = new Date(entrada.fecha)
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      entrada.fecha = day + "/" + month + "/" + year
      entrada.url = "/entradas/" + entrada._id

      res.render("entradas/entrada_delete", {
        title: `Delete Entrada`,
        entrada,
      })
    })
}

exports.entrada_delete_post = async (req, res) => {
  const entrada = await EntradasSchema.findById(req.params.id);
  BuscarInsumo(entrada.insumo_id).then(
    function (insumo) {
      var new_insumo = [];
      const new_stock = insumo[0].stock - cantidad_insumo;

      new_insumo.id = insumo[0]._id;
      new_insumo.cantidad = new_cantidad;

      ActualizarInsumo(new_insumo).then(
        function (result) {
          console.log(result);
        },
        function (error) {
          console.log(error);
        }
      )
    },
    function (error) {
      console.log(error);
    }
  )
  await EntradasSchema.findByIdAndDelete(req.params.id)
  res.redirect("/entradas")
}

exports.entrada_detail = async (req, res) => {
  const entrada = EntradasSchema.findById(req.params.id)
    .populate("insumo_id")
    .lean()
    .exec(function (err, entrada) {
      var dateObj = new Date(entrada.fecha)
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      entrada.fecha = day + "/" + month + "/" + year
      entrada.url = "/entradas/" + entrada._id

      res.render("entradas/entrada_detail", {title: "Detalle entrada", entrada})
    })
}

exports.entradas_list = async (req, res) => {
  const entradas_list = EntradasSchema.find({})
    .populate("insumo_id")
    .lean()
    .exec(function (err, entradas_list) {
      entradas_list.forEach(function (item, index) {
        var dateObj = new Date(item.fecha)
        var month = dateObj.getUTCMonth() + 1
        var day = dateObj.getUTCDate()
        var year = dateObj.getUTCFullYear()
        entradas_list[index].fecha = day + "/" + month + "/" + year
        entradas_list[index].url = "/entradas/" + item._id
      })
      console.info(entradas_list)
      res.render("entradas/entradas_list", {title: "Lista de Entradas", entradas_list})
    })
}

exports.entradas_create_get = async (req, res) => {
  const insumos = await InventarioSchema.find({})
  console.log(insumos);
  res.render("entradas_form", {title: "Añadir nuevo Insumo", insumos})
}

function BuscarInsumo(insumo_id) {
  return new Promise(function (resolve, reject) {
    InventarioSchema.find({_id: insumo_id}, function (err, insumo) {
      if (err) reject(err)
      else resolve(insumo)
    })
  })
}
function ActualizarInsumo(insumo) {
  return new Promise(function (resolve, reject) {
    InventarioSchema.findByIdAndUpdate(
      insumo.id,
      {stock: insumo.cantidad},
      function (err, result) {
        if (err) reject(err)
        else resolve(result)
      }
    )
  })
}

function SaveEntrada(fecha, insumo_id, cantidad) {
  return new Promise(function (resolve, reject) {
    const item = new EntradasSchema({fecha, insumo_id, cantidad})
    item.save(function (err, doc) {
      if (err) return reject(err)
      resolve(doc)
    })
  })
}

exports.entrada_create_post = [
  body("fecha").exists({checkFalsy: true}).trim().escape().isDate(),
  body("cantidad").exists({checkFalsy: true}).trim().escape().isInt(),
  body("_id").exists({checkFalsy: true}).trim().escape(),
  async (req, res) => {
    // eslint-disable-next-line object-curly-newline

    var fecha = req.body.fecha;
    var cantidad = req.body.cantidad;
    var insumo_id = req.body._id;

    BuscarInsumo(insumo_id).then(
      function (insumo) {
        var new_insumo = []
        const nueva_cantidad = insumo[0].stock + cantidad

        new_insumo.id = insumo[0]._id
        new_insumo.cantidad = nueva_cantidad

        ActualizarInsumo(new_insumo).then(
          function (result) {
            console.log(result)
          },
          function (error) {
            console.log(error)
          }
        )
      },
      function (error) {
        console.log(error)
      }
    );

    SaveEntrada(fecha, insumo_id, cantidad).then(
      function (result) {
        console.log(result)
        res.redirect("/entradas")
      },
      function (error) {
        console.info(error)
      }
    )
  },
]

exports.entrada_update_get = async (req, res) => {
  const receta = await RecetaSchema.findById(req.params.id)
  const receta_ingredientes_item = await RecetaIngredientesSchema.find({
    insumo_id: req.params.id,
  })
    .populate("medida_id")
    .populate("ingrediente_id")

  var ingredientes = []
  receta_ingredientes_item.forEach(function (item) {
    var ingrediente = []
    ingrediente.medida = item.medida_id.descripcion
    ingrediente.cantidad = item.qty
    ingrediente.nombre = item.ingrediente_id.insumo
    ingredientes.push(ingrediente)
  })
  const insumos = await InventarioSchema.find({})
  const unidades = await UnidadesSchema.find({})
  res.render("entradas/recetas_form", {
    title: receta.nombre,
    receta,
    ingredientes,
    insumos,
    unidades,
  })
}
