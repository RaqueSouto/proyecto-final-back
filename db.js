require("dotenv").config();

const {MongoClient,ObjectId} = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}

function contactos(){
    return new Promise(async (aceptada,rechazada) => {
        try{
            const conexion = await conectar();

            let contactos = await conexion.db("contactos").collection("contactos").find({}).toArray();

            conexion.close();

            aceptada(contactos.map(({_id,textoNombre,textoTel,textoMail}) => {
                return {id: _id,textoNombre,textoTel,textoMail};
            }));

        }catch(error){
            rechazada({ error : "error en el servidor" });
        }
    });
}

function crearContacto(textoNombre,textoTel,textoMail){
    return new Promise(async (aceptada,rechazada) => {
        try{
            const conexion = await conectar();

            let {insertedId} = await conexion.db("contactos").collection("contactos").insertOne({textoNombre,textoTel,textoMail});

            conexion.close();

            aceptada(insertedId);

        }catch(error){
            rechazada({ error : "error en el servidor" });
        }
    });
}

function borrarContacto(id){
    return new Promise(async (aceptada,rechazada) => {
        try{
            const conexion = await conectar();

            let {deletedCount} = await conexion.db("contactos").collection("contactos").deleteOne({_id : new ObjectId(id)});

            conexion.close();

            aceptada(deletedCount);

        }catch(error){
            rechazada({ error : "error en el servidor" });
        }
    });
}