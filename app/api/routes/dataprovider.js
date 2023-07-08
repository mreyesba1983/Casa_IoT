//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authentication.js');

import Data from '../models/data.js';

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
router.get('/get-small-charts-data', checkAuth, async (req, res) => {
    try {
        const userId = req.userData._id;
        const chartTimeAgo = req.query.chartTimeAgo;
        const dId = req.query.dId;
        const variable = req.query.variable;

        const timeAgoMs = Date.now() - (chartTimeAgo * 60 * 1000);
        console.log(userId);
        console.log(variable);
        console.log(dId);

        const data = await Data.find({ userId: userId, dId: dId, variable: variable, "time": {$gt: timeAgoMs} }).sort({ "time": 1 });
        console.log(data);

        const toResponse = {
            status: "success",
            data: data
        };
        return res.json(toResponse);

    } catch (error) {
        console.log(error);
        const toResponse = {
            status: "error",
            error: error
        };
        return res.json(toResponse);
    }
});


//------------------------------------------------------------------------------------------------//
//                                  FUNCIONES PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//

module.exports = router;