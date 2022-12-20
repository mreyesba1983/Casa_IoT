//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");
const router = express.Router();

//------------------------------------------------------------------------------------------------//
//                     IMPORTAMOS EL ARCHIVO authentication.js DE MIDDLEWARES                     //
//------------------------------------------------------------------------------------------------//
const { checkAuth } = require("../middlewares/authentication.js");

//------------------------------------------------------------------------------------------------//
//                                    MODELOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
import Template from '../models/template.js';

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
router.post('/template', checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        var newTemplate = req.body.template;

        newTemplate.userId = userId;
        newTemplate.createdTime = Date.now();

        const r = await Template.create(newTemplate);

        const response = {
            status: "success",
        };
        return res.json(response);
    } catch (error) {
        console.log(error);
        const response = {
            status: "error",
            error: error
        };
        return res.status(500).json(response);
    }
});

module.exports = router;