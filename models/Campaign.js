import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Campaign = db.define('campaign',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    }
})

export default Campaign