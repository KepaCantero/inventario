const {body, validationResult} = require("express-validator")
const express = require('express');
const bycrpt = require('bcrypt');
const userDB = require("../models/user")
const router = express.Router();

router.get('/', (req, res)=>{
                    res.render('auth/login',{layout: false})
                });


router.post(
    '/',
    (req, res)=>{
        const {
            username,
            password,
        } = req.body;

        userDB.find({username: username}).then((user) =>{
            if (user[0])
            {
                bycrpt.compare(password, user[0].password)
                .then((result) =>{
                    if (result){
                        res.cookie('username', username);
                        res.redirect('/inventario');
                    }
                    else{
                        const error= {
                            msg: 'Contraseña incorrecta'
                       }

                       res.render('auth/login',
                       {error: error,
                        layout: false }
                       );
                    }
                })
            }
            else
            {
                const error= {
                     msg: 'El usuario no existe'
                }
                res.render('auth/login',
                {error: error,
                layout: false }
                );

           }
        });
    });

module.exports = router;
