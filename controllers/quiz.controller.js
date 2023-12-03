const debug = require('debug')('app:post-controller');
const { ObjectId } = require('mongoose').Types;
const Quiz = require("../models/quiz.model");

const controller = {}; 

controller.findAll = async (req, res) => {
    try {
        // Obtiene todos los cuestionarios de la base de datos usando el modelo
        const cuestionarios = await Quiz.find();
        res.status(200).json({
            cuestionarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

controller.findOneById = async (req, res) => {
    try {
        const idCuestionario = req.params.id;

        // Obtiene un cuestionario por su ID usando el modelo
        const cuestionario = await Quiz.findById( {_id: new ObjectId(idCuestionario)} );

        if (!cuestionario) {
            return res.status(404).json({ ok: false, error: 'Pregunta no encontrada' });
        }

        res.status(200).json({
            ok: true,
            cuestionario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

controller.create = async (req, res) => {
    try {
        const { tema, pregunta, respuesta_correcta, respuestas_incorrectas } = req.body;

        // Verificar si la respuesta del usuario es correcta
        const esRespuestaCorrecta = respuestas_incorrectas.includes(respuesta_correcta);

        // Crear un nuevo cuestionario en la base de datos usando el modelo
        const nuevoCuestionario = new Quiz({
            tema,
            pregunta,
            respuestas: [...respuestas_incorrectas, respuesta_correcta],
            respuesta_correcta,
            es_respuesta_correcta: esRespuestaCorrecta,
        });

        // Guardar el cuestionario en la base de datos
        await nuevoCuestionario.save();

        // Responder con el resultado
        if (esRespuestaCorrecta) {
            res.status(200).json({
                ok: true,
                mensaje: '¡Respuesta correcta!',
                cuestionario: nuevoCuestionario,
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Respuesta incorrecta. La respuesta correcta es: ' + respuesta_correcta,
                cuestionario: nuevoCuestionario,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message || 'Error interno del servidor' });
    }
}

/*controller.findByDifficult = async (req, res) => {
    try {
        const dificultad = req.params.dificultad;

        // Lógica para obtener preguntas por dificultad de la base de datos
        const preguntasPorDificultad = await Quiz.find({ dificultad });

        res.status(200).json({
            ok: true,
            preguntasPorDificultad,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}*/

controller.findBySubject = async (req, res) => {
    try {
        const tema = req.params.subject;
        const preguntasPorTema = await Quiz.find( {tema: tema}).exec();

        res.status(200).json({ ok: true, preguntasPorTema });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor', details: error });
    }
}

controller.delete = async (req, res) => {
    try {
        const idPregunta = req.params.id;

        // Lógica para eliminar una pregunta por su ID de la base de datos
        const deletedQuiz = await Quiz.findByIdAndDelete({_id: new ObjectId(idPregunta)});

        if (!deletedQuiz) {
            return res.status(404).json({ error: 'Pregunta no encontrada.' });
        }

        res.status(200).json({ mensaje: "Pregunta eliminada correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

module.exports = controller; 