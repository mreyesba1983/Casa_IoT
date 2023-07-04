//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
const express = require("express");     //Librería para usar node express
const router = express.Router();
const jwt = require('jsonwebtoken');    //Librería para crear jwt para autenticación de usuarios
const bcrypt = require('bcrypt');
const { checkAuth } = require('../middlewares/authentication.js');

//------------------------------------------------------------------------------------------------//
//                                    IMPORTAMOS MODELOS                                          //
//------------------------------------------------------------------------------------------------//
import User from '../models/user.js';
import EmqxAuthRule from '../models/emqx_auth.js';

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

  //SI NO EXISTE EL USUARIO SE DEBE INDICAR QUE NO SE TIENE ACCESO
  if (!user) {
    const toSend = {
      status: "error",
      error: "notUser"
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
      error: "accessError",
    };

    return res.status(401).json(toSend);
  }
});

//OBTENER CREDENCIALES MQTT
router.post("/getmqttcredentials", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const credentials = await getWebUserMqttCredentials(userId);

    const toSend = {
      status: "success",
      username: credentials.username,
      password: credentials.password
    }

    res.json(toSend);

    setTimeout(() => {
      getWebUserMqttCredentials(userId);
    }, 5000);

    return;

  } catch (error) {
    const toSend = {
      status: "error",
      error: error
    };
    return res.status(500).json(toSend);
  }
});

//OBTENER CREDENCIALES DE ACCESO MQTT PARA RECONEXIÓN
router.post("/getmqttcredentialsforreconnection", checkAuth, async (req, res) => {
  const userId = req.userData._id;
  const credentials = await getWebUserMqttCredentialsForReconnection(userId);

  const toSend = {
    status: "success",
    username: credentials.username,
    password: credentials.password
  }
  res.json(toSend);

  setTimeout(() => {
    getWebUserMqttCredentials(userId);
  }, 15000);

  return;
});

//------------------------------------------------------------------------------------------------//
//                                  FUNCIONES PARA EL END POINT                                   //
//------------------------------------------------------------------------------------------------//
//FUNCIÓN PARA OBTENER LAS CREDENCIALES DE USUARIO MQTT
//CREDENCIALES MQTT types:"user", "device", "superuser"
async function getWebUserMqttCredentials(userId) {

  try {
    var rule = await EmqxAuthRule.find({ type: "user", userId: userId });

    if (rule.length == 0) {
      const newRule = {
        userId: userId,
        username: makeid(10),
        password: makeid(10),
        publish: [userId + "/#"],
        subscribe: [userId + "/#"],
        type: "user",
        time: Date.now(),
        updateTime: Date.now()
      };
      const result = await EmqxAuthRule.create(newRule);

      const toReturn = {
        username: result.username,
        password: result.password
      };

      return toReturn;
    }
    const newUsername = makeid(10);
    const newPassword = makeid(10);

    const result = await EmqxAuthRule.updateOne({ type: "user", userId: userId }, { $set: { username: newUsername, password: newPassword, updateTime: Date.now() }});

    if (result.n == 1 && result.ok == 1) {
      return {
        username: newUsername,
        password: newPassword
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getWebUserMqttCredentialsForReconnection(userId) {
  try {
    const rule = await EmqxAuthRule.find({ type: "user", userId: userId });
    if (rule.length == 1) {
      const toReturn = {
        username: rule[0].username,
        password: rule[0].password
      };
      return toReturn;
    }
  } catch (error) {
    console.log(error);
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
 }

module.exports = router;