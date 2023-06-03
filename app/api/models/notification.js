//------------------------------------------------------------------------------------------------//
//                                      LIBRERIAS REQUERIDAS                                      //
//------------------------------------------------------------------------------------------------//
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//------------------------------------------------------------------------------------------------//
//                                    ESQUEMA DE LA NOTIFICACIÓN                                  //
//------------------------------------------------------------------------------------------------//
const notificationSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, required: [true] },
    payload: { type: Object },
    emqxRuleId: { type: String, required: [true] },
    topic: { type: String, required: [true] },
    value: { type: Number, required: [true] },
    condition: { type: String, required: [true] },
    variable: { type: String, required: [true] },
    readed: { type: String, required: [true] },
    time: { type: Number, required: [true] }
});

//------------------------------------------------------------------------------------------------//
//                             CONVERTIR LA NOTIFICACION EN MODELO                                //
//------------------------------------------------------------------------------------------------//
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;