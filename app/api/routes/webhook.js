//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");

import Data from "../models/data.js";
import Device from "../models/device.js";

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
        const data = req.body;
        const splittedTopic = data.topic.split("/");
        const dId = splittedTopic[1];
        const variable = splittedTopic[2];

        var result = await Device.find({ dId: dId, userId: data.userId });

        if (result.length == 1) {
            Data.create({
                userId:data.userId,
                dId: dId,
                variable: variable,
                value: data.payload.value,
                time: Date.now()
            })
            console.log("Datos creados");
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }
});

module.exports = router;