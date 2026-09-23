const express = require('express');
const controlador = require('./controller');

const app = express();
app.use(express.json());

app.post('/api/tareas', controlador.postTarea);

// Se exporta 'app' para permitir las pruebas de integración con Supertest
module.exports = app;

// El servidor se inicia solo si el archivo se ejecuta directamente
if (require.main === module) {
    app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
}