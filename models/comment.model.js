const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    comentario: {
        type: Schema.Types.String,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Me_gusta: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    comentarios: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            contenido: {
                type: Schema.Types.String,
                required: true
            },
            timestamps: {
                type: Date,
                required: true
            },
            historial: {
                type: [Schema.Types.String],
                default: []
            }
        }],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
