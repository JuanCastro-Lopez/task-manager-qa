const db = require('./model');

module.exports = {
    crearTarea: (titulo) => {
        // Validación 1: Campo obligatorio
        if (!titulo || titulo.trim() === '') {
            throw new Error("El título es obligatorio");
        }
        // Validación 2: Longitud mínima
        if (titulo.length < 3) {
            throw new Error("El título es muy corto");
        }
        
        return db.guardarTarea(titulo);
    }
};