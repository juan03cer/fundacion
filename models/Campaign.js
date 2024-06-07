import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Campaign = db.define('campaign',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    calle:{
        type: DataTypes.STRING(80),
        allowNull:false,

    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lng:{
        type:DataTypes.STRING,
        allowNull:false
    }

})

export default Campaign