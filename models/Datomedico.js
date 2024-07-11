import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Datomedico = db.define('datomedico',{
    enfermedad:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ruidosonido:{
        type:DataTypes.STRING,
        allowNull:false
    },
     familiarusausado:{
        type:DataTypes.STRING,
        allowNull:false
    },
     ladoescucha:{
        type:DataTypes.STRING,
        allowNull:false
    },
     exposicion:{
        type:DataTypes.STRING,
        allowNull:false
    },
     tiporuido:{
        type:DataTypes.STRING,
        allowNull:false
    },
     diagnostico:{
        type:DataTypes.STRING,
        allowNull:false
    },  
    otorrino:{
        type:DataTypes.STRING,
        allowNull:false
    },
    audiologo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    terapeuta:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ingresaraudiometria:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    
})

export default Datomedico