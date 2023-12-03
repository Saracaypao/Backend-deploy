const { Router } = require('express');
const router = Router();

const userController = require("../controllers/user.controller");
const runValidation = require("../validators/index.middleware"); 
const { createUserValidator } = require("../validators/user.validators"); 

router.post('/newUser',
createUserValidator,
runValidation,
userController.create);
// Ruta para obtener todos los usuarios
router.get('/users', 
userController.findAll);
// Ruta para obtener un usuario por su ID
router.get('/userById/:id', 
userController.findOneById);
// Ruta para actualizar información de un usuario por su ID
router.put('/updateUser/:id', 
userController.update);

module.exports = router;
