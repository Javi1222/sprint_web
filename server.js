require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); // Necesario para leer el JSON que enviaremos desde el HTML

// 1. Configurar la conexión a MySQL usando variables de entorno (.env)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sprint_web'
});

// 2. Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conexión exitosa a la base de datos MySQL!');
});

// 3. --- NUESTRA RUTA MÁGICA --- 
// Cuando el frontend envíe datos aquí, se ejecutarán estas líneas
app.post('/api/usuarios', (req, res) => {
    // Extraemos el nombre y apellidos que viajan en el "cuerpo" (body) de la petición
    const { nombre, apellidos } = req.body;

    // Preparamos la consulta SQL (los interrogantes son por seguridad contra hackeos)
    const sql = 'INSERT INTO usuarios (nombre, apellidos) VALUES (?, ?)';
    
    // Ejecutamos la consulta en MySQL
    db.query(sql, [nombre, apellidos], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        
        console.log(`¡Nuevo usuario guardado! Nombre: ${nombre} ${apellidos}`);
        // Le respondemos al frontend que todo ha ido bien
        res.json({ mensaje: 'Datos guardados correctamente' });
    });
});

// 4. Encender el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
