import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Derecho = db.define('derecho',{
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fecha:{
        type:DataTypes.STRING,
        allowNull:false
    },
    tipo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    oido:{
        type:DataTypes.STRING,
        allowNull:false
    },
    umbral:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gradoperdida:{
        type:DataTypes.STRING,
        allowNull:false
    },
    configuracion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    patronperdida:{
        type:DataTypes.STRING,
        allowNull:false
    },
    observaciones:{
        type:DataTypes.STRING,
        allowNull:false
    },
    recomendacion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})

export default Derecho