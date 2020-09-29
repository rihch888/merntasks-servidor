const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenicarUsuario = async (req, resp) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return resp.status(400).json({ errores: errores.array() });
    }
    //extraer email y password
    const { email, password } = req.body;
    try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return resp.status(400).json({msg: 'El usuario no existe'});
        }
        //revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return resp.status(400).json({msg: 'Password incorrecto'});
        }
        //si todo es correcto crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, (error,token) => {
            if (error) throw error;
            resp.json({ token: token });
        })
    } catch (error) {
        console.log(error);
    }
}

//obtiene qué usuario está autenticado
exports.usuarioAutenticado= async (req, resp) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        resp.json({usuario});
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg: 'Hubo un error'});
    }
}