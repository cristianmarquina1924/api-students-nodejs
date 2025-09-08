const express = require('express');
const db = require('./database'); // Importa la conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios

// Rutas para estudiantes
// GET: Obtener todos los estudiantes
app.get('/students', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// POST: Crear un nuevo estudiante
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
  db.run(sql, [firstname, lastname, gender, age], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "message": "Estudiante creado exitosamente",
      "studentId": this.lastID
    });
  });
});

// Rutas para un estudiante individual
// GET: Obtener un estudiante por ID
app.get('/student/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (row) {
      res.json({
        "message": "success",
        "data": row
      });
    } else {
      res.status(404).json({ "message": "Estudiante no encontrado" });
    }
  });
});

// PUT: Actualizar un estudiante por ID
app.put('/student/:id', (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, gender, age } = req.body;
  const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
  db.run(sql, [firstname, lastname, gender, age, id], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({
        "message": "Estudiante actualizado exitosamente",
        "changes": this.changes
      });
    } else {
      res.status(404).json({ "message": "Estudiante no encontrado para actualizar" });
    }
  });
});

// DELETE: Eliminar un estudiante por ID
app.delete('/student/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM students WHERE id = ?', id, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({
        "message": "Estudiante eliminado exitosamente",
        "changes": this.changes
      });
    } else {
      res.status(404).json({ "message": "Estudiante no encontrado para eliminar" });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de la API escuchando en el puerto ${PORT}`);
});