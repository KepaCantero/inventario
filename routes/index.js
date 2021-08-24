const express = require('express');
const path = require('path');

const router = express.Router();
//const {ensureAuthenticated} = require('../config/auth')

/*router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/../views/welcome.html'));
});*/


router.get('/',(req,res)=>{
  res.redirect('/inventario');
})


module.exports = router;
