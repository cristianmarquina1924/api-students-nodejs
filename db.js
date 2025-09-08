const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./students.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado a la base de datos de estudiantes.');
});

// Crear la tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER
    )
  `, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Tabla de estudiantes creada o ya existente.');
  });
});

module.exports = db;