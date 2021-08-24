const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname+'/../views/login.html'));
})

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.sendFile(path.join(__dirname+'/../views/login.html'));
    })

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/inventario',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next)
    })




module.exports = router;
