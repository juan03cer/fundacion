import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Donadores = db.define('donadores',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    gmaildonador:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    telefono:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    
})

export default Donadores