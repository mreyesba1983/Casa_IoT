//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");     //Librería para usar node express
const router = express.Router();
const jwt = require('jsonwebtoken');    //Librería para crear jwt para autenticación de usuarios
const bvrypt = require('bcrypt');

//------------------------------------------------------------------------------------------------//
//                          IMPORTAMOS EL USUARIO CREADO COMO ESQUEMA                             //
//------------------------------------------------------------------------------------------------//
import User from '../models/user.js';

router.get('/new-user', async (req, res) => {
    try {
        const user = await User.create({
          nombre: "Manuel",
          email: "mreyesba@gmail.com",
          password: "121212",
        });
        res.json({ status: "success" });
    } catch (error) {
        console.log("Fallo al crear el usuario!!!".red);
        console.log(error);
        res.json({ "status": "fail" });
    }
    
});

module.exports = router;