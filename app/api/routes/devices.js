//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express"); //Librería para usar node express
const router = express.Router();

//------------------------------------------------------------------------------------------------//
//                     IMPORTAMOS EL ARCHIVO authentication.js DE MIDDLEWARES                     //
//------------------------------------------------------------------------------------------------//
const { checkAuth } = require('../middlewares/authentication.js');

import { interpolateRgbBasisClosed } from 'd3';
//------------------------------------------------------------------------------------------------//
//                                    MODELOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
import Device from '../models/device.js';

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
router.get("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const devices = await Device.find({ userId: userId });

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

router.post("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        var newDevice = req.body.newDevice;

        newDevice.userId = userId;
        newDevice.createdTime = Date.now();

        const device = await Device.create(newDevice);

        selectedDevice(userId, newDevice.dId);

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

router.delete("/device", checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const dId = req.query.dId;

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

router.put("/device", checkAuth, async (req, res) => {
    const dId = req.body.dId;
    const userId = req.userData._id;

    if (selectedDevice(userId, dId)) {
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

module.exports = router;