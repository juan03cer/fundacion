import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Accionesprevias = db.define('accionesprevias',{
    empresaimplante:{
        type:DataTypes.STRING,
        allowNull:false
    },
    marcas:{
        type:DataTypes.STRING,
        allowNull:false
    },
    cotizacion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    centroimplante:{
        type:DataTypes.STRING,
        allowNull:false
    },
    contacto:{
        type:DataTypes.STRING,
        allowNull:false
    },
    cualcontacto:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apoyo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    quien:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})

export default Accionesprevias