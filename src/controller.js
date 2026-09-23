const servicio = require('./service');

module.exports = {
    postTarea: (req, res) => {
        try {
            const tarea = servicio.crearTarea(req.body.titulo);
            res.status(201).json(tarea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};