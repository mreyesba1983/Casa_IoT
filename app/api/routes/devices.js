//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express"); //Librería para usar node express
const router = express.Router();
const axios = require("axios");
//------------------------------------------------------------------------------------------------//
//                     IMPORTAMOS EL ARCHIVO authentication.js DE MIDDLEWARES                     //
//------------------------------------------------------------------------------------------------//
const { checkAuth } = require('../middlewares/authentication.js');

//------------------------------------------------------------------------------------------------//
//                                    MODELOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
import Device from '../models/device.js';
import SaverRule from '../models/emqx_saver_rule.js';

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
const auth = {
    auth: {
        username: 'admin',
        password: 'Access_INT'
    }
};

//Leer dispositivos
router.get("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        //BUscamos todos los dispositivos asociados al usuario, guardamos como VAR para desacoplar el objeto
        var devices = await Device.find({ userId: userId });
        //Convertimos el objeto devices en un array y evitar reactividad no deseada
        devices = JSON.parse(JSON.stringify(devices));

        //Buscamos todas las saver rules del usuario
        const saverRules = await getSaverRules(userId);

        //Creamos un array que contenga la información de los saverRules en cada dispositivo
        devices.forEach((device, index) => {
            devices[index].saverRule = saverRules.filter(saverRule => saverRule.dId == device.dId)[0];
        });

        const toSend = {
        status: "success",
        data: devices,
        error: "null",
        };
        return res.json(toSend); 
    } catch (error) {
        const toSend = {
            status: "Error",
            error: error
        }
        return res.status(500).json(toSend);
    }
});
//Crear un nuevo dispositivo
router.post("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        var newDevice = req.body.newDevice;

        newDevice.userId = userId;
        newDevice.createdTime = Date.now();

        await createSaverRule(userId, newDevice.dId, true);

        const device = await Device.create(newDevice);

        await selectedDevice(userId, newDevice.dId);

        const toSend = {
          status: "success",
          error: "null",
        };
        return res.json(toSend);    
    } catch (error) {
        console.log("Error creando un dispositivo nuevo!!!");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }

    
});
//Eliminar un dispositivo
router.delete("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const dId = req.query.dId;

        //Elimina la regla creada en EMQX
        await deleteSaverRule(dId);
        //Elimina el dispositivo de nuestro FRONTEND y tambien de la base de datos
        const result = await Device.deleteOne({ userId: userId, dId: dId });

        const toSend = {
            status: "success",
            data: result,
          error: "null",
        };
        return res.json(toSend);
    } catch (error) {
        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
});
//Actualizar un dispositivo
router.put("/device", checkAuth, async (req, res) => {
    const dId = req.body.dId;
    const userId = req.userData._id;

    if (await selectedDevice(userId, dId)) {
        const toSend = {
            status: "success",
            error: "null"
        };
        return res.json(toSend);
    } else {
        const toSend = {
            status: "error",
            error: "Error al ejecutar función selectedDevice"
        };
        return res.json(toSend);
    }
});

//Actualizar la regla de un dispositivo
router.put("/saver-rule", checkAuth, async (req, res) => {
    const rule = req.body.rule;

    await updateSaverRuleStatus(rule.emqxRuleId, rule.status);

    const toSend = {
        status: "success"
    };
    res.json(toSend);
});

//------------------------------------------------------------------------------------------------//
//                                  FUNCIONES PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
async function selectedDevice(userId, deviceId) {
    try {
        const result = await Device.updateMany( { userId: userId }, { selected: false });
        const result1 = await Device.updateOne( { dId: deviceId, userId: userId }, { selected: true });
        
        return true;
    } catch (error) {
        console.log("Error en la función selectedDevice");
        return false;
    }
    
}

//Función para crear una regla en EMQX
async function createSaverRule(userId, dId, status) {
    try {
        //Dirección para acceder ala API de EMQX y crear una regla
        const url = "http://localhost:8085/api/v4/rules";
        //Topico que va a ser enviado a EMQX
        const topic = userId + "/" + dId + "/+/sdata";
        //Codigo SQL para filtrar los mensajes en la regla
        const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";
        //Variable para crear una nueva regla
        var newRule = {
            rawsql: rawsql,
            actions: [
                {
                    name: "data_to_webserver",
                    params: {
                        $resource: global.saverResource.id,
                        payload_tmpl: '{"userId":"' + userId + '", "payload":${payload}, "topic":"${topic}"}'
                    }
                }
            ],
            description: "SAVER-RULE",
            enabled: status
        };
        //Se envia con el método POST la regla que deseamos crear
        const res = await axios.post(url, newRule, auth);
        //Revisamos si la regla se creo correctamente, revisando el status de la comunicacion y si se recibieron datos
        if(res.status === 200 && res.data.data) {
            
            await SaverRule.create({
                userId: userId,
                dId: dId,
                emqxRuleId: res.data.data.id,
                status: status
            });
            console.log("Regla creada correctamente!".green);
            return true;
        } else {
            return false;
        }   
    } catch (error) {
        console.log("Error al crear la saver rule");
        console.log(error);
        return false;
    }
}

//Función para listar las reglas creadas en EMQX
async function getSaverRules(userId) {
    try {
        const rules = await SaverRule.find({ userId: userId });
        return rules;
    } catch (error) {
        return false;
    }
}

//Función para actualizar una regla ya creada en EMQX
async function updateSaverRuleStatus(emqxRuleId, status) {
    const url = "http://localhost:8085/api/v4/rules/" + emqxRuleId;

    const newRule = {
        enabled: status
    }
    const res = await axios.put(url, newRule, auth);

    if (res.status === 200 && res.data.data) {
        await SaverRule.updateOne({ emqxRuleId: emqxRuleId }, { status: status });
        console.log("Regla en EMQX actualizada correctamente...".green);
        return {
            status: "success",
            action: "updated"
        }
    }
}

//Función para borrar una regla creada en EMQX
async function deleteSaverRule(dId) {
    try {
        const mongoRule = await SaverRule.findOne({ dId: dId });
        const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;
        const emqxRule = await axios.delete(url, auth);
        const deleted = await SaverRule.deleteOne({ dId: dId });

        return true;
    } catch (error) {
        console.log("Error al borrar regla de EMQX".red);
        console.log(error);
        return false;
    }
    
}

module.exports = router;