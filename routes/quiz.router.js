const { Router } = require('express');
const router = Router();

const quizController = require("../controllers/quiz.controller"); 

// Ruta para obtener todos los quizzes
router.get('/quizzes', quizController.findAll);
// Ruta para obtener información de un quiz por su ID
router.get('/quizById/:id', quizController.findOneById);
// Ruta para crear un nuevo quiz
router.post('/createQuiz', quizController.create);
// Ruta para obtener preguntas por dificultad
//router.get('/byDifficulty/:difficult', quizController.findByDifficult);
// Ruta para obtener preguntas por tema
router.get('/bySubject/:subject', quizController.findBySubject);
// Ruta para eliminar una pregunta por su ID
router.delete('/deleteQuestion/:id', quizController.delete);

module.exports = router; 