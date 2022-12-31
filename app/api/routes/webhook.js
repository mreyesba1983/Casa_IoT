//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
router.post("/saver-webhook", async (req, res) => {
    const data = req.body;  //Se recibe la información sin autenticación
    console.log("Dato recibido: ");
    console.log(data);
    const toSend = {
        "Recibido": "OK"
    };
    res.json(toSend);
});

module.exports = router;