require("dotenv").config();

const express = require("express");
const { json } = require("body-parser");
const cors = require("cors");
const { contactos, crearContacto, borrarContacto, editarContacto } = require("./db");

const servidor = express();

servidor.use(cors());
servidor.use(json());

servidor.get("/contactos", async (peticion, respuesta) => {
    try {
        let resultado = await contactos();
        // Mapear los contactos para asegurar que todos tengan un id único
        resultado = resultado.map(contacto => {
            if (!contacto.id) {
                contacto.id = generarIdUnica();
            }
            return contacto;
        });
        respuesta.json(resultado);
    } catch (error) {
        respuesta.status(500);
        respuesta.json(error); // Enviar respuesta de error en caso de fallo
    }
});

// Función para generar ids únicas y solucionar el problema de falta de keys
function generarIdUnica() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

servidor.post("/contactos/nuevo", async (peticion, respuesta) => {
    const { textoNombre, textoTel, textoMail } = peticion.body;

    // Validar que los datos estén completos
    if (!textoNombre || !textoTel || !textoMail) {
        return respuesta.status(400).json({ error: "Datos incompletos" });
    }
    try {
        // Crear un nuevo contacto
        let id = await crearContacto(textoNombre, textoTel, textoMail);
        respuesta.json({ id });
    } catch (error) {
        respuesta.status(500);
        respuesta.json(error); // Enviar respuesta de error en caso de fallo
    }
});

servidor.put("/contactos/actualizar/:id([0-9a-f]{24})/:operacion(1|2)", async (peticion, respuesta) => {
    let operacion = Number(peticion.params.operacion);
    let funcion = [editarContacto];
    const { textoNombre, textoTel, textoMail } = peticion.body;

    // Validar los datos de la operación de actualización
    if (operacion === 1 && (!textoNombre || !textoTel || !textoMail)) {
        return respuesta.status(400).json({ error: "Datos incompletos" });
    }

    try {
        // Editar el contacto correspondiente
        let count = await funcion[operacion - 1](peticion.params.id, textoNombre, textoTel, textoMail);
        respuesta.json({ resultado: count ? "aceptada" : "rechazada" });
    } catch (error) {
        respuesta.status(500);
        respuesta.json(error); // Enviar respuesta de error en caso de fallo
    }
});

servidor.delete("/contactos/borrar/:id([0-9a-f]{24})", async (peticion, respuesta) => {
    try {
        // Borrar el contacto correspondiente
        let count = await borrarContacto(peticion.params.id);
        respuesta.json({ resultado: count ? "aceptada" : "rechazada" });
    } catch (error) {
        respuesta.status(500);
        respuesta.json(error); // Enviar respuesta de error en caso de fallo
    }
});

// Manejar rutas no encontradas
servidor.use((peticion, respuesta) => {
    respuesta.status(404);
    respuesta.json({ error: "recurso no encontrado" });
});

// Manejar errores en la petición
servidor.use((error, peticion, respuesta, siguiente) => {
    respuesta.status(400);
    respuesta.json({ error: "error en la petición" });
});

// Iniciar el servidor en el puerto especificado en el archivo .env
servidor.listen(process.env.PORT);
