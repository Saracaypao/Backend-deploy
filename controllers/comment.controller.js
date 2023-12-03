const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const { MongoCryptKMSRequestNetworkTimeoutError } = require('mongodb');
const debug = require('debug')('app:post-controller');

const controller = {};

controller.findAll = async (req, res) => {
    try {
        const comment = await Comment.find({ hidden: false })
            .populate("user", "usuario correo")
            .populate("Me_gusta", "usuario correo")
            .populate("comentarios.user", "usuario correo");

        res.status(200).json({
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
};

controller.findOneById = async (req, res) => {
    try {
        const idComentario = req.params;
        const comentario = await Comment.findOne({ _id: new ObjectId(idComentario), hidden: false })
            .populate("user", "usuario correo")
            .populate("Me_gusta", "usuario correo")
            .populate("comentarios.user", "usuario correo");

        if (!comentario) {
            return res.status(404).json({ ok: false, error: 'Comentario no encontrado' });
        }

        res.status(200).json({
            ok: true,
            comentario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
};

controller.findByUser = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        const comments = await Comment.find({ user: identifier, hidden: false })
            .populate("user", "usuario correo -_id")
            .populate("Me_gusta", "usuario correo")
            .populate("comentarios.user", "usuario correo");

        return res.status(200).json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
};

controller.findOwn = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;

        const comments = await Comment.find({ user: userId })
            .populate("user", "usuario correo")
            .populate("Me_gusta", "usuario correo")
            .populate("comentarios.user", "usuario correo");

        return res.status(200).json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
};

controller.save = async (req, res) => {
    try {
        const { comentario } = req.body;
        const { identifier } = req.params;
        const { user } = req;

        let comment;

        // Verificar si ya existe un comentario con el identificador proporcionado
        if (identifier) {
            comment = await Comment.findById(identifier);

            // Verificar si el comentario existe y si el usuario que intenta actualizar es el creador
            if (!comment || !comment.user.equals(user._id)) {
                return res.status(403).json({ error: 'Este no es tu comentario' });
            }
        } else {
            // Si no hay identificador, crear un nuevo comentario
            comment = new Comment();
            comment.user = user._id;
        }

        comment.comentario = comentario;

        const comentarioGuardado = await comment.save();
        if (!comentarioGuardado) {
            return res.status(409).json({ error: 'Error creando/comentando' });
        }

        return res.status(201).json(comentarioGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message || 'Error interno del servidor' });
    }
};

controller.meGustaAComment = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        const user = req.user;

        const comment = await Comment.findOne({ _id: identifier, hidden: false })
            .populate("user", "usuario correo")
            .populate("comentarios.user", "usuario correo");

        if (!comment) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        let _Me_gusta = comment["Me_gusta"] || [];
        const alreadyMe_gusta = _Me_gusta.findIndex(_i => _i.equals(user._id)) >= 0;

        if (alreadyMe_gusta) {
            _Me_gusta = _Me_gusta.filter(_i => !_i.equals(user._id));
        } else {
         _Me_gusta = [user._id, ..._Me_gusta]; 
        }

        // Asignar directamente el arreglo actualizado
        comment["Me_gusta"] = _Me_gusta;

        const nuevoComentario = await (await comment.save())
            .populate("Me_gusta", "usuario correo");

        return res.status(200).json(nuevoComentario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
};

controller.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const deleteComment = await Comment.findOneAndDelete({ _id: new ObjectId(id) });

        if (!deleteComment) {
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }

        return res.status(200).json({ mensaje: 'Comentario eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
};

controller.saveComment = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        const { contenido, _id: commentId } = req.body;
        const user = req.user;

        let comment;

        // Si hay un commentId, significa que es una actualización de comentario anidado
        if (commentId) {
            comment = await Comment.findOne({ "comentarios._id": commentId, hidden: false })
                .populate("user", "usuario correo")
                .populate("Me_gusta", "usuario correo");
        } else {
            // Si no hay commentId, significa que es un comentario principal
            comment = await Comment.findById(identifier)
                .populate("user", "usuario correo")
                .populate("Me_gusta", "usuario correo");
        }

        if (!comment) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        // Si hay un commentId, es una actualización de comentario anidado
        if (commentId) {
            const comentarioIndex = comment.comentarios.findIndex(_c => _c._id.equals(commentId));

            if (comentarioIndex >= 0) {
                const _comment = comment.comentarios[comentarioIndex];

                // Guarda el contenido anterior en el historial
                _comment.historial.push(_comment.contenido);

                // Actualiza el contenido del comentario
                _comment.contenido = contenido;

                // Actualiza directamente el comentario en el array
                comment.comentarios.set(comentarioIndex, _comment);
            } else {
                return res.status(404).json({ error: "Comentario anidado no encontrado" });
            }
        } else {
            // Si no hay commentId, es un nuevo comentario principal
            const nuevoComentario = {
                user: user._id,
                timestamps: new Date(),
                contenido: contenido,
                historial: [],
            };

            // Agrega el nuevo comentario al array de comentarios
            comment.comentarios.push(nuevoComentario);
        }

        // Guarda el comentario actualizado
        const comentarioGuardado = await comment.save();

        // Devuelve la respuesta con el comentario actualizado
        return res.status(200).json({
            comentario: commentId ?
                comentarioGuardado.comentarios.find(_c => _c._id.equals(commentId)) :
                comentarioGuardado.comentarios[comentarioGuardado.comentarios.length - 1],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
    }
};


module.exports = controller;
