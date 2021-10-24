const {body, validationResult} = require("express-validator")

const RecetaSchema = require("../models/receta")
const InventarioSchema = require("../models/inventario")
const RecetasSchema = require("../models/receta")
const SalidasSchema = require("../models/salidas")
const RecetaIngredientesSchema = require("../models/receta_ingredientes")

var async = require("async")

exports.salida_delete_get = async (req, res) => {
  const salida = SalidasSchema.findById(req.params.id)
    .populate("receta_id")
    .lean()
    .exec(function (err, salida) {
      var dateObj = new Date(salida.fecha)
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      salida.fecha = day + "/" + month + "/" + year
      salida.url = "/salidas/" + salida._id

      res.render("salidas/salida_delete", {
        title: `Delete Salida`,
        salida,
      })
    })
}

exports.salida_delete_post = async (req, res) => {

  const salida = await SalidasSchema.findById(req.params.id);

  BuscarIngredientes(salida.receta_id).then(
    function (receta_ingredientes_item) {
      receta_ingredientes_item.forEach(function (item) {
        var cantidad_insumo = salida.cantidad * item.qty;
        insumo_id = item.ingrediente_id;
        BuscarInsumo(insumo_id).then(
          function (insumo) {
            var new_insumo = [];
            const new_stock = insumo[0].stock + cantidad_insumo;

            new_insumo.id = insumo[0]._id;
            new_insumo.stock = new_stock;

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
      })
    },
    function (error) {
      console.log(error);
    }
  )
  await SalidasSchema.findByIdAndDelete(req.params.id)
  res.redirect("/salidas")
}

exports.salida_detail = async (req, res) => {
  const salida = SalidasSchema.findById(req.params.id)
    .populate("receta_id")
    .lean()
    .exec(function (err, salida) {
      var dateObj = new Date(salida.fecha)
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      salida.fecha = day + "/" + month + "/" + year
      salida.url = "/salidas/" + salida._id
      console.info(salida)

      res.render("salidas/salida_detail", {title: "Detalle salida", salida})
    })
}

exports.salidas_list = async (req, res) => {
  const salidas_list = SalidasSchema.find({})
    .populate("receta_id")
    .lean()
    .exec(function (err, salidas_list) {
      salidas_list.forEach(function (item, index) {
        var dateObj = new Date(item.fecha)
        var month = dateObj.getUTCMonth() + 1
        var day = dateObj.getUTCDate()
        var year = dateObj.getUTCFullYear()
        salidas_list[index].fecha = day + "/" + month + "/" + year
        salidas_list[index].url = "/salidas/" + item._id
      })
      res.render("salidas/salidas_list", {title: "Lista de Salidas", salidas_list})
    })
}

exports.salidas_create_get = async (req, res) => {
  const recetas = await RecetasSchema.find({})
  res.render("salidas/salidas_form", {title: "Añadir nueva Receta", recetas})
}

function BuscarIngredientes(receta_id) {
  return new Promise(function (resolve, reject) {
    RecetaIngredientesSchema.find(
      {receta_id: receta_id},
      function (err, insumo) {
        if (err) reject(err)
        else resolve(insumo)
      }
    )
  })
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
      {stock: insumo.stock},
      function (err, result) {
        if (err) reject(err)
        else resolve(result)
      }
    )
  })
}

function SaveSalida(fecha, receta_id, cantidad) {
  return new Promise(function (resolve, reject) {
    const item = new SalidasSchema({fecha, receta_id, cantidad})
    item.save(function (err, doc) {
      if (err) return reject(err)
      resolve(doc)
    })
  })
}

exports.salida_create_post = [
  body("fecha").exists({checkFalsy: true}).trim().escape().isDate(),
  body("cantidad").exists({checkFalsy: true}).trim().escape().isInt(),
  body("receta_id").exists({checkFalsy: true}).trim().escape(),
  async (req, res) => {
    // eslint-disable-next-line object-curly-newline

    var fecha = req.body.fecha;
    var cantidad = req.body.cantidad;
    var receta_id = req.body.receta_id;
    BuscarIngredientes(receta_id).then(
      function (receta_ingredientes_item) {
        receta_ingredientes_item.forEach(function (item) {
          var cantidad_insumo = cantidad * item.qty
          insumo_id = item.ingrediente_id
          BuscarInsumo(insumo_id).then(
            function (insumo) {
              var new_insumo = []
              const new_stock = insumo[0].stock - cantidad_insumo

              new_insumo.id = insumo[0]._id
              new_insumo.stock = new_stock

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
          )
        })
      },
      function (error) {
        console.log(error)
      }
    )

    SaveSalida(fecha, receta_id, cantidad).then(
      function (result) {
        console.log(result)
        res.redirect("/salidas")
      },
      function (error) {
        console.info(error)
      }
    )
  },
]

exports.salida_update_get = async (req, res) => {
  const receta = await RecetaSchema.findById(req.params.id)
  const receta_ingredientes_item = await RecetaIngredientesSchema.find({
    receta_id: req.params.id,
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
  res.render("salidas/recetas_form", {
    title: receta.nombre,
    receta,
    ingredientes,
    insumos,
    unidades,
  })
}
