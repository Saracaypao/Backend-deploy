const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    tema: {
        type: Schema.Types.String,
        required: true
    },
    pregunta: {
        type: Schema.Types.String,
        required: true
    },
    respuestas: {
        type: Schema.Types.Mixed,
        required: true
    },
    respuesta_correcta: {
        type: Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model("Quiz", quizSchema);

