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
    const user = await User.create({
        name: "Manuel",
        email: "mreyesba@gmail.com",
        password: "121212"
    });
});

module.exports = router;