const User = require("../models/user.model"); 
const { createToken, verifyToken } = require("../utils/jwt.tools");

const controller = {}; 

controller.logIn = async (req, res) => {
    try {
      const { correo, contrasena } = req.body;
  
      const user = await User.findOne({ correo });
  
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      if (!user.compareContrasena(contrasena)) {
        return res.status(401).json({ error: "Contraseña incorrecta." });
      }
  
      // Crear un token
      const token = await createToken(user._id);
  
      // Almacenar Token
      let _tokens = [...user.tokens];
      const _verifyPromises = _tokens.map(async (_t) => {
        const status = await verifyToken(_t);
        return status ? _t : null;
      });
  
      _tokens = (await Promise.all(_verifyPromises))
        .filter(_t => _t)
        .slice(0, 4);
  
      _tokens = [token, ..._tokens];
      user.tokens = _tokens;
  
      await user.save();
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Error interno del servidor',
        error: error.message || 'Error interno del servidor',
      });
    }
  }

  controller.whoAmI = async (req, res, next) => {
    try {
      const { _id, usuario, correo, roles } = req.user; // Cambiado de req.params a req.user
      return res.status(200).json({ _id, usuario, correo, roles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: 'Error interno del servidor' });
    }
  }

module.exports = controller; 