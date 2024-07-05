import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Derecho = db.define('derecho',{
 
    responsable:{
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
    tipoygrado :{
        type:DataTypes.STRING,
        allowNull:false
    },
    patrónperdida:{
        type:DataTypes.STRING,
        allowNull:false
    },
    observaciones:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Diagnóstico :{
        type:DataTypes.STRING,
        allowNull:false
    },
    Recomendaciones:{
        type:DataTypes.STRING,
        allowNull:false
    },
})

export default Derecho