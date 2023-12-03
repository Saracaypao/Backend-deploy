const { ObjectId } = require('mongoose').Types; 
const User = require("../models/user.model");
const ROLES =require("../data/roles.constants.json"); 

const controller = {}; 

controller.create = async (req, res) => {
    try {
        const { nombre, usuario, correo, contrasena } = req.body;

        const user = await User.findOne({ $or: [{usuario:usuario},{correo: correo}]}); 
        
        if(user){
            return res.status(409).json({ error: "El usuario ya existe"}); 
        }

        const nuevoUsuario = new User({
            ok:true,
            nombre,
            usuario,
            correo,
            contrasena,
            roles: [ROLES.USER]
        });

        // Guarda el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(200).json({
            ok: true,
            usuario: nuevoUsuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message || 'Error interno del servidor' });
    }
}

controller.findAll = async (req, res) => {
    try {
        // Obtiene todos los usuarios de la base de datos usando el modelo
        const usuarios = await User.find();
        res.status(200).json({
            ok: true,
            usuarios,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

controller.findOneById = async (req, res) => {
    try {
        const idUsuario = req.params.id;

        // Obtiene un usuario por su ID usando el modelo
        const usuario = await User.findById(idUsuario);

        res.status(200).json({
            ok: true,
            usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

controller.update = async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const { nombre, usuario, correo, contrasena } = req.body;

        // Actualizar la información del usuario en la base de datos usando el modelo
        const usuarioActualizado = await User.findByIdAndUpdate(
            {_id: new ObjectId(idUsuario)},
            { nombre, usuario, correo, contrasena },
            { new: true } // Devuelve el usuario actualizado
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
}

module.exports = controller; 