//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//------------------------------------------------------------------------------------------------//
//                                          ESQUEMA DEL DATO                                      //
//------------------------------------------------------------------------------------------------//
const dataSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, required: [true] },
    variable: { type: String, required: [true] },
    value: { type: Number, required: [true] },
    time: { type: Number, required: [true] }
});

//------------------------------------------------------------------------------------------------//
//                                  CONVERTIR EL DATO EN MODELO                                   //
//------------------------------------------------------------------------------------------------//
const Data = mongoose.model("Data", dataSchema);

export default Data;