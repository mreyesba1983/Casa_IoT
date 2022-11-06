//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");     //Librería para usar node express
const router = express.Router();
const jwt = require('jsonwebtoken');    //Librería para crear jwt para autenticación de usuarios
const bcrypt = require('bcrypt');

//------------------------------------------------------------------------------------------------//
//                          IMPORTAMOS EL USUARIO CREADO COMO ESQUEMA                             //
//------------------------------------------------------------------------------------------------//
import User from '../models/user.js';

//------------------------------------------------------------------------------------------------//
//                                    METODOS PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
router.post("/register", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const encryptedPassword = bcrypt.hashSync(password, 10);

        const newUser = {
          name: name,
          email: email,
          password: encryptedPassword,
        };

        var user = await User.create(newUser);
        const toSend = {
          status: "Success"
        };
        res.status(200).json(toSend);    
    } catch (error) {
      console.log("Error al registrar usuario");
      console.log(error);
      const toSend = {
        status: "Fail",
        error: error
      };

      res.status(500).json(toSend);
    }
    
});

router.post("/login", (req, res) => {

});

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