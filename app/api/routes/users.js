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

//CREACIÓN DE UN USUARIO NUEVO
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      name: name,
      lastname: lastname,
      email: email,
      password: encryptedPassword,
    };

    var user = await User.create(newUser);
    const toSend = {
      status: "Success"
    };
    return res.status(200).json(toSend);    
  } catch (error) {
    console.log("Error al registrar usuario");
    const toSend = {
      status: "Fail",
      error: error
    };

    return res.status(500).json(toSend);
  }    
});

//INGRESO DE UN USUARIO
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var user = await User.findOne({
    email: email
  });

//SI NO EXISTE EL USUARIO SE DEBE INDICAR QUE LAS CREDENCIALES DE ACCESO SON INVALIDAS
  if (!user) {
    const toSend = {
      status: "error",
      error: "Credenciales de acceso invalidas"
    }

    return res.status(401).json(toSend);
  }

//SI EXISTE EL USUARIO SE VERIFICA LA CONTRASEÑA DE ACCESO
  if (bcrypt.compareSync(password, user.password)) {
    user.set('password', undefined, { strict: false });
    const token = jwt.sign({ userData: user }, 'IngNovaTech2023&Isabella', { expiresIn: 60 * 60 * 24 * 30});
    const toSend = {
      status: "success",
      token: token,
      userData: user,
      error: "null"
    }

    return res.json(toSend);
  } else {
    const toSend = {
      status: "error",
      error: "Credenciales de acceso invalidas",
    };

    return res.status(401).json(toSend);
  }
});

module.exports = router;