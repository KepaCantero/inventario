const {body, validationResult} = require("express-validator")
const express = require('express');
const bycrpt = require('bcrypt');
const userDB = require("../models/user")
const router = express.Router();

router.get('/', (req, res)=>{
    res.clearCookie('username');
    res.redirect('/login');
})

module.exports = router;
