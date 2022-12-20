//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require('express');         //Librería para usar node express
const morgan = require("morgan");           //librería para conocer quien esta accediendo a los endpoints
const cors = require("cors");               //Librería que induce las politicas de acceso a la API
const mongoose = require("mongoose");       //Librería para interactuar con MongoDB
const colors = require("colors");           //Librería que permite imprimir "console.log" con colores

//------------------------------------------------------------------------------------------------//
//                                          INSTANCIAS                                            //
//------------------------------------------------------------------------------------------------//
const app = express();

//------------------------------------------------------------------------------------------------//
//                                  CONFIGURACIÓN DE EXPRESS                                      //
//------------------------------------------------------------------------------------------------//
app.use(morgan("tiny"));            //Indica a que endpoint estan accediendo y si existe o no el endpoint
app.use(express.json());            //Permite trabajar con JSON en express
app.use(express.urlencoded({        //Permite pasar parametros por la dirección URL hacia el endpoint
    extended: true
}));
app.use(cors());                    //Politicas de acceso se incluyen en express

//------------------------------------------------------------------------------------------------//
//                                 RUTAS DE ACCESO DE LA API                                      //
//------------------------------------------------------------------------------------------------//
app.use("/api", require("./routes/devices.js"));
app.use("/api", require("./routes/users.js"));
app.use("/api", require("./routes/templates.js"));

module.exports = app;               //Permite ordenar las rutas de los endpoints en archivos separados

//------------------------------------------------------------------------------------------------//
//                  SECCIÓN DE ESCUCHA DE LA API PARA DETECTAR PETICIONES                         //
//------------------------------------------------------------------------------------------------//
app.listen(3001, () => {
    console.log("API server escuchando por el puerto 3001");
});

//------------------------------------------------------------------------------------------------//
//                                  CONEXIÓN A MONGO DB                                           //
//------------------------------------------------------------------------------------------------//
const mongoUserName = "User_MongoDB";
const mongoPassword = "MongoDB_2021";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "IngNovaTechDB";

var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};

mongoose.connect(uri, options).then(() => {
    console.log("\n");
    console.log("***********************************".green);
    console.log("   Conectado con la base de datos  ".green);
    console.log("***********************************".green);
    console.log("\n");
}, (err) => {
    console.log("\n");
    console.log("***********************************".red);
    console.log("    Conexionado fallida a la BD    ".red);
    console.log("***********************************".red);
    console.log("\n");
});