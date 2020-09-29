const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsurio = async (req, resp) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return resp.status(400).json({errores: errores.array()})
    }

    const { email, password } =req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return resp.status(400).json({ msg: 'El usuario ya existe' });
        }
        usuario = new Usuario(req.body);
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        await usuario.save();
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
        resp.status(400).send('Hubo un error');   
    }
}