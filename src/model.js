let baseDeDatos = [];

module.exports = {
    guardarTarea: (titulo) => {
        const nuevaTarea = { id: baseDeDatos.length + 1, titulo };
        baseDeDatos.push(nuevaTarea);
        return nuevaTarea;
    },
    obtenerTodas: () => baseDeDatos,
    
    // Utilidad para reiniciar el estado entre pruebas
    limpiarBD: () => { baseDeDatos = []; }
};