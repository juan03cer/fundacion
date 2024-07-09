import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Historialauditivo = db.define('historialauditivo',{
  
    antecedentes:{
        type:DataTypes.STRING,
        allowNull:false
    },
    factores:{
        type:DataTypes.STRING,
        allowNull:false
    },
    problemas:{
        type:DataTypes.STRING,
        allowNull:false
    },
    familiares:{
        type:DataTypes.STRING,
        allowNull:false
    },
    expuesto:{
        type:DataTypes.STRING,
        allowNull:false
    },
    proteccion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    infecciones :{
        type:DataTypes.STRING,
        allowNull:false
    },
    cirugia:{
        type:DataTypes.STRING,
        allowNull:false
    },
    medicamentos:{
        type:DataTypes.STRING,
        allowNull:false
    },
    covid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dificultades:{
        type:DataTypes.STRING,
        allowNull:false
    },
    volumen:{
        type:DataTypes.STRING,
        allowNull:false
    },
    zumbidos :{
        type:DataTypes.STRING,
        allowNull:false
    },
    sonidos:{
        type:DataTypes.STRING,
        allowNull:false
    },
    sufrido:{
        type:DataTypes.STRING,
        allowNull:false
    },
    episodios:{
        type:DataTypes.STRING,
        allowNull:false
    },
    musica:{
        type:DataTypes.STRING,
        allowNull:false
    },
    habitos :{
        type:DataTypes.STRING,
        allowNull:false
    },
    sustancias:{
        type:DataTypes.STRING,
        allowNull:false
    },
    tabaco:{
        type:DataTypes.STRING,
        allowNull:false
    },
    conversaciones :{
        type:DataTypes.STRING,
        allowNull:false
    },
    murmurar:{
        type:DataTypes.STRING,
        allowNull:false
    },
    situaciones:{
        type:DataTypes.STRING,
        allowNull:false
    },
    audicion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pruebaauditiva:{
        type:DataTypes.STRING,
        allowNull:false
    },
    resultadoh :{
        type:DataTypes.STRING,
        allowNull:false
    },
    consultado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    diagnostico:{
        type:DataTypes.STRING,
        allowNull:false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})

export default Historialauditivo