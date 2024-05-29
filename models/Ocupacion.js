import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ocupacion= db.define('ocupacion',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    }
})

export default Ocupacion

