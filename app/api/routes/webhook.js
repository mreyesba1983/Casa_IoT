//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

import Data from "../models/data.js";
import Device from "../models/device.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import Notification from "../models/notification.js";

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
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
        } else {
            const lastNotifToNowMins = ( Date.now() - lastNotif[0].time ) / 1000 / 60;
            if (lastNotifToNowMins > incomingAlarm.triggerTime) {
                console.log("Alarma continua...".red)
                saveNotifToMongo(incomingAlarm);
            }
        }

        

        const splittedTopic = incomingAlarm.topic.split("/");
        const dId = splittedTopic[1];
        const variable = splittedTopic[2];

        var result = await Device.find({ dId: dId, userId: incomingAlarm.userId });

        if (result.length == 1) {
            Data.create({
                userId:incomingAlarm.userId,
                dId: dId,
                variable: variable,
                value: incomingAlarm.payload.value,
                time: Date.now()
            })
            console.log("Datos creados".green);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }
});

function saveNotifToMongo(data) {
    var newNotif = data;
    newNotif.time = Date.now();
    newNotif.readed = false;
    Notification.create(newNotif);
}

async function updateAlarmCounter(emqxRuleId) {
    try {
        await AlarmRule.update({ emqxRuleId: emqxRuleId }, { $inc: { counter: 1 } });
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;