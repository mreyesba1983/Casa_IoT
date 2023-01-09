//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

//------------------------------------------------------------------------------------------------//
//                                    DEFINICIÓN DE VARIABLES                                     //
//------------------------------------------------------------------------------------------------//
const auth = {
    auth: {
        username: 'admin',
        password: 'Access_INT'
    }
};

global.saverResource = null;
global.alarmResource = null;

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
//Método para listar los RESOURCES creados en EMQX
async function listResources() {
    try {
        //Dirección para listar los RESOURCES que se han creado en EMQX
        const url = "http://localhost:8085/api/v4/resources/";
        //Se accede a la dirección usando el método GET
        const res = await axios.get(url, auth);
        //Se determina la cantidad de RESOURCES que se han creado
        const size = res.data.data.length;
        //Si la comunicación con EMQX fue exitosa se continua
        if (res.status === 200) {
            //Si no hay ningún RESOURCE se debe llamar una función para crearlas
            if (size == 0) {
                console.log("¡¡¡¡¡¡¡ Creando RESOURCES en EMQX !!!!!!!".red);
                createResources();
                //Si ya tenemos 2 RESOURCES debemos verificar si son las requeridas
            } else if (size == 2) {
                res.data.data.forEach((resource) => {
                    if (resource.description == "alarm-webhook") {
                        global.alarmResource = resource;
                    }
                    if (resource.description == "saver-webhook") {
                        global.saverResource = resource;
                    }
                    console.log(global.alarmResource);
                    console.log("------------".blue);
                    console.log(global.saverResource);
                    console.log("------------".blue);
                });
            //Si se tienen mas de dos o un solo RESOURCE es necesario indicarle al usuario que debe eliminar los RESOURCES y crear solo dos SAVER-WEBHOOK y ALARM-WEBHOOK
            } else {
                console.log("----------------".yellow);
                console.log("Crear los resources desde EMQX");
                console.log("----------------".yellow);
            }
        } else {
            console.log("Error al comunicarse con EMQX!!!!!");
        }    
    } catch (error) {
        console.log("Error al listar los recursos de EMQX");
        console.log(error);
    }
    

};

//Método para crear RESOURCES en EMQX
async function createResources() {
    try {
        //Dirección para acceder a la API de EMQX
        const url = "http://localhost:8085/api/v4/resources/";
        //Datos requeridos para crear un RESOURCE en EMQX
        const data1 = {
            type: "web_hook",
            id: "webHookR:0001",
            config: {
                url: "http://192.168.1.16:3001/api/saver-webhook",
                headers: {
                    token: "121212",
                },
            method: "POST",
            },
            description: "saver-webhook",
        };
        const data2 = {
            type: "web_hook",
            id: "webHookR:0002",
            config: {
                url: "http://localhost:3001/api/alarm-webhook",
                headers: {
                    token: "121212",
                },
                method: "POST",
            },
            description: "alarm-webhook",
        };

        //Se envia el RESOURCE a EMQX usando el método POST
        const res1 = await axios.post(url, data1, auth);
        //Se verifica que el RESOURCE se haya creado correctamente
        if (res1.status === 200) {
            console.log(
                "El RESOURCE llamado saver-webhook fue creado exitosamente".green
            );
        }
        //Se envia el RESOURCE a EMQX usando el método POST
        const res2 = await axios.post(url, data2, auth);
        //Se verifica que el RESOURCE se haya creado correctamente
        if (res2.status === 200) {
            console.log(
                "El RESOURCE llamado alarm-webhook fue creado exitosamente".green
            );
        }
        setTimeout(() => {
            console.log("Los RESOURCES fueron creados".green);
            listResources();
        }, 1000);
    } catch (error) {
        console.log("Error al crear los RESOURCES en EMQX!!!!".red);
        console.log(error);
    }
}

setTimeout(() => {
    listResources();
}, 1000);

module.exports = router;
