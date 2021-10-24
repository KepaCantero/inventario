const {body, validationResult} = require("express-validator")
const express = require('express');
const bycrpt = require('bcrypt');
const userDB = require("../models/user")
const router = express.Router();

router.get('/', (req, res)=>{
                    res.render('auth/signup',{layout: false})
                });


router.post(
    '/',
    body('username').trim().escape(),
    body('password').isLength({
        min: 6
    }),
    (req, res)=>{
        const errors = validationResult(req);
        console.log(errors.array().length );
        const {
            username,
            password,
        } = req.body;
        if (errors.array().length === 0){
            console.log("form valid!");
            bycrpt.hash(password, 10)
                .then((password) => {
                    const user = new userDB({ username, password })
                    user.save().then((result)=>{
                        console.log(result);
                        res.redirect('/inventario');
                    });
            });
        }
        else{
            res.render('auth/signup',
            {errors: errors.array() }
            );
        }
    });

module.exports = router;
