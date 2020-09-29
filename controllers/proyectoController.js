const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, resp) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return resp.status(400).json({errores: errores.array()})
    }
    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //guardar el creador del proyecto vía JWT
        proyecto.creador = req.usuario.id;
        //guardamos el proyexto
        proyecto.save();
        resp.json(proyecto);
    } catch (error) {
        console.log(error);
        resp.status.send('Hubo un error');
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, resp) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        resp.json({proyectos});
    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}

//actualiza un proyecto 
exports.actualizarProyecto = async (req, resp) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return resp.status(400).json({errores: errores.array()})
    }
    //extraer la información del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si el proyecto existe
        if (!proyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //actualizar el proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id}, { $set: nuevoProyecto }, { new: true });
        resp.json({proyecto});

    } catch (error) {
        console.log(error);
        resp.status(500).send('Error en el servidor');
    }
}

//elimina un proyecto por su id
exports.eliminarProyecto = async (req, resp) => {
    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si el proyecto existe
        if (!proyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //eliminar el proyecto
        await Proyecto.findOneAndRemove( {_id: req.params.id });
        resp.json({ msg: 'Proyecto eliminado correctamente' });

    } catch (error) {
        console.log(error);
        resp.status(500).send('Error en el servidor');
    }
    
}