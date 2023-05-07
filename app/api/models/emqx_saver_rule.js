//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//------------------------------------------------------------------------------------------------//
//                                      ESQUEMA DEL GANCHO                                        //
//------------------------------------------------------------------------------------------------//
const saverRuleSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type:String, required: [true] },
    emqxRuleId: { type: String, required: [true] },
    status: { type: Boolean, required: [true] }
});

//------------------------------------------------------------------------------------------------//
//                                  CONVERTIR LA ALARMA EN MODELO                                 //
//------------------------------------------------------------------------------------------------//
const SaverRule = mongoose.model('SaverRule', saverRuleSchema);

export default SaverRule;