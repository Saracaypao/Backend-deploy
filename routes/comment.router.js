const express = require("express");
const router = express.Router();

const { createCommentValidator, idInParamsValidator, saveCommentValidator } = require("../validators/comment.validator");
const validateFields = require("../validators/index.middleware");

const commentController = require("../controllers/comment.controller");

const { authentication, authorization } = require("../middlewares/auth.middlewares")

const ROLES = require("../data/roles.constants.json");

// Ruta para obtener todos los comentarios
router.get('/comments',
    commentController.findAll);
router.get('/own',
    authentication,
    authorization(ROLES.USER),
    commentController.findOwn);
//  Ruta para obterner los comentarios por usuario 
router.get('/userComments/:identifier',
    idInParamsValidator,
    validateFields,
    commentController.findByUser);
// Ruta para obtener comentarios de un usuario por su ID
router.get('/commentsById/:id',
    validateFields,
    idInParamsValidator,
    commentController.findOneById);
// Ruta para crear un comentario
router.post(["/", "/:identifier"],
    authentication,
    authorization(ROLES.USER),
    createCommentValidator,
    validateFields,
    commentController.save);

router.patch("/Like/:identifier", 
authentication, 
authorization(ROLES.USER),
idInParamsValidator, 
validateFields, 
commentController.meGustaAComment); 

router.patch("/comment/:identifier", 
authentication, 
authorization(ROLES.USER), 
idInParamsValidator, 
saveCommentValidator, 
validateFields, 
commentController.saveComment)
// Ruta para eliminar un comentario
router.delete('/deleteComment/:id',
    authentication,
    authorization(ROLES.USER),
    validateFields,
    idInParamsValidator,
    commentController.deleteComment);

module.exports = router; 