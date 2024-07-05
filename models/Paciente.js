import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Paciente = db.define('pacientes',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    },
    
    sexo:{
        type: DataTypes.STRING,
        allowNull:false,
    },
   
    segdgasmdcs:{
        type: DataTypes.STRING,
        allowNull:false
    },
    numpaciente:{
        type:DataTypes.STRING,
        allowNull:false

    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false

    },
    telrecados:{
        type:DataTypes.STRING
    },
    calle:{
        type: DataTypes.STRING,
        allowNull:false,

    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lng:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    companion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    telcompanion:{
        type:DataTypes.STRING,
        allowNull:false

    },
    canaldereferencia:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fechanacimiento:{
        type:DataTypes.STRING(50),
        allowNull:false
    }, 
    edad:{
        type:DataTypes.STRING(50),
        allowNull:false
    }, 
    meses:{
        type:DataTypes.STRING(50),
        allowNull:false
    }

})

export default Paciente