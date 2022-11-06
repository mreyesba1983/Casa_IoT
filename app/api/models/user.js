//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
import mongoose from "mongoose"; //Librería para trabajar con Mongo DB
const uniqueValidator = require("mongoose-unique-validator"); //Verificación de datos únicos y que nadie mas los tenga

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: [true] },
  email: { type: String, required: [true], unique: true },
  password: { type: String, required: [true] },
});

//------------------------------------------------------------------------------------------------//
//                          VERIFICACIÓN DE CORREO ELECTRONICO UNICO                              //
//------------------------------------------------------------------------------------------------//
userSchema.plugin(uniqueValidator, { message: 'Error, el correo electrónico ya existe!!!' });

//------------------------------------------------------------------------------------------------//
//                              CONVERTIR EL USUARIO EN MODELO                                    //
//------------------------------------------------------------------------------------------------//
const User = mongoose.model('User', userSchema);
export default User;