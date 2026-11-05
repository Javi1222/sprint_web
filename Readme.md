# 🚀 Sprint Web Full-Stack: Registro de Usuarios

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

Un proyecto *Full-Stack* ligero y rápido construido como un "sprint" de aprendizaje. Su objetivo es demostrar de forma clara y directa cómo fluyen los datos desde una interfaz web (Frontend) hasta una base de datos relacional (Backend + DB), sin utilizar frameworks complejos en el lado del cliente.

## 🧠 ¿Cómo funciona? La Arquitectura

El proyecto sigue una arquitectura clásica de cliente-servidor de 3 capas:

1. **📱 Frontend (Interfaz de Usuario):** Un archivo `index.html` con Vanilla JavaScript. Captura el nombre y apellido del usuario. Al hacer clic en enviar, utiliza la API `fetch()` nativa para transformar esos datos en un objeto JSON y enviarlos por HTTP (POST).
2. **⚙️ Backend (API REST):** Un servidor construido en **Node.js** con **Express**. Escucha en el puerto 3000. Recibe el JSON, lo desempaqueta y utiliza el controlador `mysql2` para formular una consulta SQL segura.
3. **💾 Base de Datos:** Un servidor **MySQL 8.0** que recibe la instrucción `INSERT`, guarda los datos de forma persistente y devuelve una confirmación al backend.

---

## 🛠️ Requisitos Previos

Para ejecutar este proyecto en tu máquina local, necesitarás tener instalado:
- [Node.js](https://nodejs.org/) (incluye `npm`)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (versión 8.0 recomendada)

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno completo en tu máquina:

### 1. Preparar la Base de Datos
Abre tu cliente de MySQL (consola o MySQL Workbench) y ejecuta el siguiente script DDL para crear la base de datos y la tabla:

```sql
CREATE DATABASE sprint_web;
USE sprint_web;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);
```

### 2. Configurar el Backend
Clona este repositorio y navega hasta la carpeta del proyecto. Luego, instala las dependencias de Node.js:

```bash
npm install
```

> **⚠️ Importante:** Antes de arrancar el servidor, abre el archivo `server.js` y asegúrate de modificar las credenciales de conexión a MySQL (usuario y contraseña) para que coincidan con las de tu máquina local:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Tu usuario
    password: 'TU_CONTRASEÑA', // Tu contraseña
    database: 'sprint_web'
});
```

Arranca el servidor con:
```bash
node server.js
```
*(Deberías ver un mensaje indicando que el servidor corre en el puerto 3000 y se ha conectado a MySQL).*

### 3. Lanzar el Frontend
Con el servidor Node.js corriendo de fondo, simplemente haz doble clic en el archivo `index.html` para abrirlo en tu navegador favorito. ¡Escribe un nombre, pulsa enviar y mira la magia ocurrir!

---

## 📁 Estructura del Proyecto

```text
📦 sprint_web
 ┣ 📜 index.html       # Frontend: Interfaz y lógica de envío (Fetch)
 ┣ 📜 server.js        # Backend: Servidor Express y conexión MySQL
 ┣ 📜 package.json     # Configuración y dependencias del proyecto Node
 ┗ 📜 README.md        # Documentación del proyecto
```

## ✨ Próximas Mejoras (To-Do)
- [ ] Añadir validación de datos también en el Backend.
- [ ] Crear una tabla debajo del formulario que muestre (GET) los usuarios ya registrados.
- [ ] Mejorar los estilos con un framework CSS como Tailwind o Bootstrap.