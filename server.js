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

// 3. --- RUTA: REGISTRO DE USUARIOS --- 
// Cuando el frontend envíe datos de un nuevo usuario, se guardan en la tabla 'usuarios'
app.post('/api/usuarios', (req, res) => {
    // Extraemos el nombre y apellidos que viajan en el "cuerpo" (body) de la petición
    const { nombre, apellidos } = req.body;

    // Preparamos la consulta SQL (los interrogantes son por seguridad contra SQL Injection)
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

// =========================================================================
// 4. --- NUEVA RUTA: CREACIÓN DINÁMICA DE TABLAS EN MYSQL ---
// Permite crear una nueva tabla con clave primaria y las columnas que defina el usuario
// =========================================================================
app.post('/api/tablas', (req, res) => {
    // Extraemos del body:
    // - nombreTabla: String con el nombre de la tabla (ej: "productos")
    // - columnas: Array de objetos [{ nombre: "precio", tipo: "DECIMAL(10,2)" }, ...]
    const { nombreTabla, columnas } = req.body;

    // --- PASO 1: Validación de seguridad contra SQL Injection ---
    // NOTA DIDÁCTICA (BDD): En SQL, los nombres de tablas y columnas (identificadores)
    // NO se pueden parametrizar con '?' como los valores. Para evitar que un usuario
    // malintencionado inyecte comandos SQL maliciosos, usamos una expresión regular
    // que solo permita letras (a-z, A-Z), números (0-9) y guiones bajos (_).
    const regexIdentificador = /^[a-zA-Z0-9_]+$/;

    if (!nombreTabla || !regexIdentificador.test(nombreTabla)) {
        return res.status(400).json({ 
            error: 'El nombre de la tabla es inválido. Solo debe contener letras, números y guiones bajos.' 
        });
    }

    // Lista blanca de tipos de datos SQL permitidos para mayor seguridad
    const tiposPermitidos = [
        'VARCHAR(50)',
        'VARCHAR(100)',
        'VARCHAR(255)',
        'INT',
        'DECIMAL(10,2)',
        'TEXT',
        'DATE',
        'DATETIME',
        'BOOLEAN'
    ];

    // --- PASO 2: Construcción de la definición de columnas ---
    // Por buena práctica en diseño de BDD, siempre creamos una clave primaria 'id' autoincremental
    const definicionesColumnas = ['`id` INT AUTO_INCREMENT PRIMARY KEY'];

    // Si el usuario nos envía columnas adicionales, las validamos y agregamos
    if (Array.isArray(columnas) && columnas.length > 0) {
        for (const col of columnas) {
            const nombreCol = (col.nombre || '').trim();
            const tipoCol = (col.tipo || '').trim().toUpperCase();

            // Validamos el nombre de la columna
            if (!regexIdentificador.test(nombreCol)) {
                return res.status(400).json({ 
                    error: `El nombre de la columna "${nombreCol}" no es válido.` 
                });
            }

            // Validamos que el tipo esté en la lista permitida
            if (!tiposPermitidos.includes(tipoCol)) {
                return res.status(400).json({ 
                    error: `El tipo de dato "${tipoCol}" no está permitido.` 
                });
            }

            // Envolvemos los nombres en comillas invertidas (backticks) por seguridad sintáctica en MySQL
            definicionesColumnas.push(`\`${nombreCol}\` ${tipoCol}`);
        }
    }

    // --- PASO 3: Generación de la sentencia CREATE TABLE ---
    // Usamos 'IF NOT EXISTS' para que la consulta no falle si la tabla ya existía
    const sql = `CREATE TABLE IF NOT EXISTS \`${nombreTabla}\` (${definicionesColumnas.join(', ')})`;

    console.log(`Ejecutando SQL: ${sql}`);

    // --- PASO 4: Ejecución en la base de datos MySQL ---
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al crear la tabla en MySQL:', err);
            return res.status(500).json({ 
                error: 'No se pudo crear la tabla en la base de datos',
                detalle: err.message 
            });
        }

        console.log(`¡Tabla "${nombreTabla}" creada con éxito!`);
        res.status(201).json({ 
            mensaje: `Tabla "${nombreTabla}" creada correctamente en MySQL`,
            sqlEjecutado: sql 
        });
    });
});

// 5. Encender el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
