require("dotenv").config();

const {MongoClient,ObjectId} = require("mongodb");

//Conexión con la base de datos
function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}
//Petición para leer los contactos
function contactos(){
    return new Promise(async (aceptada,rechazada) => {
        try{
            //Conexión con la base de datos
            const conexion = await conectar();
            //Variable de la consulta para leer
            let contactos = await conexion.db("contactos").collection("contactos").find({}).toArray();
            //Cerrar conexión con base de datos
            conexion.close();
            //La petición aceptada
            aceptada(contactos.map(({_id,textoNombre,textoTel,textoMail}) => {
                return {id: _id,textoNombre,textoTel,textoMail};
            }));

        }catch(error){
            //La petición rechazada
            rechazada({ error : "error en el servidor" });
        }
    });
}
//Petición para crear nuevos contactos
function crearContacto(textoNombre,textoTel,textoMail){
    return new Promise(async (aceptada,rechazada) => {
        try{
            //Conexión con la base de datos
            const conexion = await conectar();
            //Variable de la consulta para crear
            let {insertedId} = await conexion.db("contactos").collection("contactos").insertOne({textoNombre,textoTel,textoMail});
            //Cerrar conexión con base de datos
            conexion.close();
            //La petición aceptada
            aceptada(insertedId);

        }catch(error){
            //console.log(error);
            //La petición rechazada
            rechazada({ error : "error en el servidor" });
        }
    });
}
//Petición para borrar contactos
function borrarContacto(id){
    return new Promise(async (aceptada,rechazada) => {
        try{
            //Conexión con la base de datos
            const conexion = await conectar();
            //Variable de la consulta para borrar
            let {deletedCount} = await conexion.db("contactos").collection("contactos").deleteOne({_id : new ObjectId(id)});
            //Cerrar conexión con base de datos
            conexion.close();
            //La petición aceptada
            aceptada(deletedCount);

        }catch(error){
            //La petición rechazada
            rechazada({ error : "error en el servidor" });
        }
    });
}
//Petición para editar los contactos
function editarContacto(id,textoNombre,textoTel,textoMail){
    return new Promise(async(aceptada,rechazada) => {
        try{
            //Conexión con la base de datos
            const conexion = await conectar();
            //Variable de la consulta para editar
            let {modifiedCount} = await conexion.db("contactos").collection("contactos").updateOne({_id : new ObjectId(id)},{ $set : {textoNombre : textoNombre, textoTel : textoTel, textoMail : textoMail}});
            //Cerrar conexión con base de datos
            conexion.close();
            //La petición aceptada
            aceptada(modifiedCount);

        }catch(error){
            //La petición rechazada
            rechazada({ error : "error en el servidor" });
        }
    });
}

//Exportación de los módulos
module.exports = {contactos,crearContacto,borrarContacto,editarContacto};

//Pruebas de las peticiones
/*
crearContacto("María Pérez","678893443","mariaperez@gmail.com")
.then(x => console.log(x))
.catch(x => console.log(x))
*/
/*
contactos()
.then(x => console.log(x))
.catch(x => console.log(x))
*/
/*
borrarContacto('6693a70a6e91b91358ff4d4c')
.then(x => console.log(x))
.catch(x => console.log(x))
*/
/*
editarContacto('6693a77d9c670d14a73e18d2',"María Fernández","674823743","mariafernandez@gmail.com")
.then(x => console.log(x))
.catch(x => console.log(x))
*/
