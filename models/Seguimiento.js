import { DataTypes, STRING } from "sequelize";
import db from "../config/db.js";

const Seguimiento = db.define('seguimiento',{
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    motivofinalizacion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    calendariodellamadas:{
        type:DataTypes.STRING,
        allowNull:false
    },
    observaciondellamadas:{
        type:DataTypes.STRING,
        allowNull:false
    },
    agendarllamada:{
        type:DataTypes.STRING,
        allowNull:false
    },
    clave:{
        type:DataTypes.STRING,
        allowNull:false
    }
    
})

export default Seguimiento