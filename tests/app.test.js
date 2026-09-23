const db = require('../src/model');
const servicio = require('../src/service');
const controlador = require('../src/controller');
const request = require('supertest');
const app = require('../src/server');

// Limpieza del estado global antes de cada prueba
beforeEach(() => { db.limpiarBD(); });


// ==========================================
// 1. PRUEBAS UNITARIAS
// ==========================================
describe('Pruebas Unitarias (Aisladas)', () => {
    
    test('El Modelo debe guardar y autoincrementar el ID', () => {
        const tarea = db.guardarTarea("Actualizar dependencias");
        expect(tarea.id).toBe(1);
        expect(tarea.titulo).toBe("Actualizar dependencias");
    });
});


// ==========================================
// 2. PRUEBAS DE INTEGRACIÓN
// ==========================================
describe('Pruebas de Integración (Conectando Capas)', () => {

    // A. ENFOQUE TOP-DOWN (De arriba hacia abajo)
    test('Top-Down: Controlador -> Servicio Simulado (STUB)', () => {
        // Arrange: Se simula el Servicio para aislar la capa de BD
        const stubServicio = jest.spyOn(servicio, 'crearTarea')
                                 .mockReturnValue({ id: 99, titulo: "Tarea Mock" });
        
        // Objetos mock de Express
        const req = { body: { titulo: "Tarea Mock" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Act
        controlador.postTarea(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        stubServicio.mockRestore();
    });

    // B. ENFOQUE BOTTOM-UP (De abajo hacia arriba)
    test('Bottom-Up: Base de Datos REAL + Servicio', () => {
        // Act: Interacción directa con el servicio
        servicio.crearTarea("Verificación de integración");
        
        // Assert
        const datosReales = db.obtenerTodas();
        expect(datosReales.length).toBe(1);
        expect(datosReales[0].titulo).toBe("Verificación de integración");
    });

    // C. ENFOQUE BIG BANG
    test('Big Bang: Controlador + Servicio + BD', () => {
        const req = { body: { titulo: "Prueba E2E interna" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Act
        controlador.postTarea(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(db.obtenerTodas()[0].titulo).toBe("Prueba E2E interna");
    });
});


// ==========================================
// 3. PRUEBAS DE SISTEMA
// ==========================================
describe('Pruebas de Sistema (Supertest)', () => {
    
    test('Debe resolver el ciclo completo HTTP correctamente', async () => {
        const respuesta = await request(app)
            .post('/api/tareas')
            .send({ titulo: "Desplegar aplicación" });

        expect(respuesta.status).toBe(201);
        expect(respuesta.body.id).toBe(1);
    });
});


// ==========================================
// 4. PRUEBAS DE REGRESIÓN
// ==========================================
describe('Pruebas de Regresión', () => {
    
    test('Validación de formato estricto (Evitar inserción de espacios)', () => {
        // Garantiza que las correcciones aplicadas a validaciones pasadas se mantengan vigentes.
        expect(() => {
            servicio.crearTarea("    ");
        }).toThrow("El título es obligatorio");
    });
});