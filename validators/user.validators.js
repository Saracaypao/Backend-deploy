const { body } = require("express-validator"); 

const validators = {};
const contrasenaRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/; 

validators.createUserValidator = [
    body("nombre")
    .notEmpty().withMessage("Nombre es requerido.")
    .isLength({ max: 100 }).withMessage("La longitud máxima del nombre es de 100 caracteres."),
    body("usuario")
    .notEmpty().withMessage("Usuario es requerido.")
    .isLength({ min:4, max: 32 }).withMessage("Formato de usuario incorrecto."),
    body("correo")
    .notEmpty().withMessage("Correo es requerido.")
    .isEmail().withMessage("Formato de correo incorrecto."),
    body("contrasena")
    .notEmpty().withMessage("Contrasena es requerida")
    .matches(contrasenaRegexp).withMessage("Formato de contrasena incorrecto.")
]

module.exports = validators;