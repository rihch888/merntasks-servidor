const jwt = require('jsonwebtoken');

module.exports = function(req,resp,next) {
    //leer el token del header
    const token = req.header('x-auth-token');
    console.log(token);

    //revisar si no hay token
    if (!token) {
        return resp.status(401).json({ msg: 'No hay token, permiso no válido'});
    }

    //validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        resp.status(401).json({ msg: 'Token no válido' });
    }

}