const { Router } = require('express');
const router = Router();

const authController = require("../controllers/auth.controller"); 
const { authentication } = require('../middlewares/auth.middlewares');


//Ruta para iniciar sesión con un usuario ya existente
router.post('/logIn', authController.logIn);

router.get('/whoAmI', 
authentication, 
authController.whoAmI); 


module.exports = router; 