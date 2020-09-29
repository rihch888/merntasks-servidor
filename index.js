const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//conectar a base de datos
conectarDB();

//habilitar cors
var corsOptions = {
    origin: 'https://hidden-garden-05738.herokuapp.com/',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));

//habilitar express.json
app.use(express.json({ extended: true }));

//puerto de la app
const port= process.env.port || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app
app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor está funcionando en el puerto ${port}`);
})