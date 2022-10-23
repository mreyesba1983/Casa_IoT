//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express"); //Librería para usar node express
const router = express.Router();

router.get("/testing", (req, res) => {
    res.send("Respuesta desde devices.js");
});

module.exports = router;