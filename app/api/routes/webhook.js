//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");
var mqtt = require("mqtt");

import { setTimeout } from "core-js";
import Data from "../models/data.js";
import Device from "../models/device.js";
import EmqxAuthRule from "../models/emqx_auth.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import Notification from "../models/notification.js";
import Template from "../models/template.js";
import { checkAuth } from "../middlewares/authentication.js";

//Definimos una variable llamada "client" para crearla de forma global
var client;

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
//Credenciales de acceso para dispositivos
router.post("/getdevicecredentials", async (req, res) => {
    const dId = req.body.dId;

    const password = req.body.password;

    const device = await Device.findOne({ dId: dId });

    if (password != device.password) {
        return res.status(401).json();
    }

    const userId = device.userId;

    var credentials = await getDeviceMqttCredentials(dId, userId);
    var template = await Template.findOne({ _id: device.templateId });

    var variables = [];

    template.widgets.forEach(widget => {
        var v = (({
            variable,
            variableFullName,
            variableType,
            variableSendFreq
        }) => ({
            variable,
            variableFullName,
            variableType,
            variableSendFreq
        })) (widget);
        
        variables.push(v);
    });

    const toSend = {
        username: credentials.username,
        password: credentials.password,
        topic: userId + "/" + dId + "/",
        variables: variables
    };
    res.json(toSend);

    setTimeout(() => {
        getDeviceMqttCredentials(dId, userId);
    }, 30000);
});

//Webhook para salvar información
router.post("/saver-webhook", async (req, res) => {
    if (req.headers.token != "121212") {
        req.sendStatus(404);
        return;
    }

    const data = req.body;
    //Dividimos el tópico en Strings independientes cada vez que encuentre "/"
    const topicDiv = data.topic.split("/");
    const dId = topicDiv[1];
    const variable = topicDiv[2];
    const value = data.payload.value;
    const time = Date.now();
    //Busca el dispositivo en la base de datos
    var result = await Device.find({dId: dId, userId: data.userId});

    if (result.length == 1) {
        Data.create({
            userId: data.userId,
            dId: dId,
            variable: variable,
            value: value,
            time: time
        })
    }

    res.sendStatus(200);

    console.log("Dato recibido: ".green);
    console.log(data);
});
//Webhook para detectar una alarma
router.post("/alarm-webhook", async (req, res) => {
    try {
        if (req.headers.token != "121212") {
            req.sendStatus(404);
            return;
        }

        res.sendStatus(200);

        const incomingAlarm = req.body;
        console.log(incomingAlarm);

        updateAlarmCounter(incomingAlarm.emqxRuleId);

        const lastNotif = await Notification.find({ dId: incomingAlarm.dId, emqxRuleId: incomingAlarm.emqxRuleId }).sort({ time: -1 }).limit(1);

        if (lastNotif == 0) {
            console.log("Primera alarma generada".red);
            saveNotifToMongo(incomingAlarm);
            sendMqttNotif(incomingAlarm);
        } else {
            const lastNotifToNowMins = ( Date.now() - lastNotif[0].time ) / 1000 / 60;
            if (lastNotifToNowMins > incomingAlarm.triggerTime) {
                console.log("Alarma continua...".red)
                saveNotifToMongo(incomingAlarm);
                sendMqttNotif(incomingAlarm);
            }
        }

        // const splittedTopic = incomingAlarm.topic.split("/");
        // const dId = splittedTopic[1];
        // const variable = splittedTopic[2];

        // var result = await Device.find({ dId: dId, userId: incomingAlarm.userId });

        // if (result.length == 1) {
        //     Data.create({
        //         userId:incomingAlarm.userId,
        //         dId: dId,
        //         variable: variable,
        //         value: incomingAlarm.payload.value,
        //         time: Date.now()
        //     })
        //     console.log("Datos creados".green);
        // }
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }
});

//Leemos las notificaciones que estan guardadas en base de datos
router.get("/notifications", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const notifications = await getNotifications(userId);
        const toSend = {
            status: "Success",
            data: notifications
        };
        res.json(toSend);
    } catch (error) {
        console.log("Error leyendo las notificaciones!".red);
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };

        return res.status(500).json(toSend);
    }
});

//Actualizamos el estado de lectura de las notificaciones
router.put("/notifications", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const notificationId = req.body.notifId;
        await Notification.updateOne({ userId: userId, _id: notificationId }, { readed: true });
        const toSend = {
            status: "success"
        };
        res.json(toSend);
    } catch (error) {
        console.log("Error al actualizar estado de la notificaión");
        console.log(error);
        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
});

//------------------------------------------------------------------------------------------------//
//                                  FUNCIONES PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
async function getDeviceMqttCredentials(dId, userId) {
    try {
        var rule = await EmqxAuthRule.find({ type: "device", userId: userId, dId: dId });
        if (rule.length == 0) {
            const newRule = {
                userId: userId,
                username: makedata(10),
                password: makedata(10),
                publish: [userId + "/" + dId + "/+/sdata"],
                subscribe: [userId + "/" + dId + "/+/actdata"],
                type: "device",
                time: Date.now(),
                updatedTime: Date.now()
            };
            const result = await EmqxAuthRule.create(newRule);
            const toReturn = {
                username: result.username,
                password: result.password
            };
            return toReturn;
        }
        const newUserName = makedata(10);
        const newPassword = makedata(10);

        const result = await EmqxAuthRule.updateOne({ type: "device", dId: dId}, { $set: { username: newUserName, password: newPassword, updatedTime: Date.now() }});

        if (result.n == 1 && result.ok == 1) {
            return { username: newUserName, password: newPassword };
        } else {
            return false;            
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

function startMqttClient() {
    //Creamos las opciones para crear el cliente MQTT en EMQX
    const options = {
        port: 1883,
        host: 'localhost',
        clientId: 'webhook_superuser' + Math.round(Math.random() * (0 - 10000) * -1),
        username: 'Usuario',
        password: 'Usuario',
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
    }
    //Creamos el cliente
    client = mqtt.connect('mqtt://' + 'localhost', options);
    //Revisamos si la conexión fue exitosa
    client.on('connect', function() {
        console.log("CONEXIÓN MQTT -> Exitosa!!!".bgGreen);
        console.log("\n");
    });
    //Si la conexión falla, repetimos la conexión
    client.on('reconnect', (error) => {
        console.log("Reconectando a MQTT".bgYellow);
        console.log(error);
    });
    //Si se presenta un error en la comunicación MQTT
    client.on('error', (error) => {
        console.log("MQTT conexión ->  FALLO :(".bgRed);
        console.log(error);
    });
}

function sendMqttNotif(notif) {
    const topic = notif.userId + '/datos/variable/notif';
    const msg = 'La regla de alarma: cuando la ' + notif.variableFullName + ' es ' + notif.condition + ' que ' + notif.value;
    client.publish(topic, msg);
}

function saveNotifToMongo(data) {
    try {
        var newNotif = data;
        newNotif.time = Date.now();
        newNotif.readed = false;
        Notification.create(newNotif);
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateAlarmCounter(emqxRuleId) {
    try {
        await AlarmRule.updateOne({ emqxRuleId: emqxRuleId }, { $inc: { counter: 1 } });
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getNotifications(userId) {
    try {
        const res = await Notification.find({ userId: userId, readed: false });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Función para crear valores aleatorios para los dispositivos que se creen
function makedata(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//Se llama a la función para iniciar un cliente MQTT
setTimeout(() => {
    startMqttClient();
}, 3000);

module.exports = router;