import Seguridadsocial from "./Seguridadsocial.js";
import Companyseguros from "./Companyseguros.js";
import Titularseguridadsocial from "./Titularseguridadsocial.js";
import Usuario from './Usuario.js'
import Paciente from "./Paciente.js";
import Campaign from "./Campaign.js";
import Datomedico from "./Datomedico.js";
import Donadores  from './Donadores.js'
import Serviciorequerido from "./Serviciorequerido.js";
import Beneficiario from "./Beneficiario.js";
import Medios from "./Medios.js";
import Escolaridad from "./Escolaridad.js";
import Ocupacion from "./Ocupacion.js";
import Parentesco from "./Parentesco.js"
import Accionesprevias from "./Accionesprevias.js";
import Seguimiento from "./Seguimiento.js";
import Izquierdo from "./Izquierdo.js";
import Derecho from "./Derecho.js"
import Historialauditivo from "./Historialauditivo.js"

Paciente.belongsTo(Seguridadsocial,{foreignKey: 'seguridadsocialid'})
Paciente.belongsTo(Companyseguros,{foreignKey: 'companysegurosid'})
Paciente.belongsTo(Titularseguridadsocial,{foreignKey: 'titularseguridadsocialid'})
Paciente.belongsTo(Usuario,{foreignKey:'usuarioid'})
Paciente.belongsTo(Campaign,{foreignKey:'campaignid'})

Datomedico.belongsTo(Serviciorequerido,{foreignKey:'serviciorequeridoid'})


Paciente.belongsTo(Datomedico,{foreignKey:'datomedicoid'})
Paciente.belongsTo(Izquierdo,{foreignKey:'izquierdoid'})
Paciente.belongsTo(Derecho,{foreignKey:'derechoid'})
Paciente.belongsTo(Beneficiario,{foreignKey:'beneficiarioid'})
Paciente.belongsTo(Medios,{foreignKey:'mediosid'})
Paciente.belongsTo(Parentesco,{foreignKey:'parentescoid'})
Paciente.belongsTo(Accionesprevias,{foreignKey:'accionespreviasid'})
Paciente.belongsTo(Seguimiento,{foreignKey:'seguimientoid'})
Paciente.belongsTo(Historialauditivo,{foreignKey:'historialauditivoid'})


Datomedico.belongsTo(Usuario,{foreignKey:'usuariodatomedicoid'})
Izquierdo.belongsTo(Usuario,{foreignKey:'usuarioizquierdoid'})
Derecho.belongsTo(Usuario,{foreignKey:'usuarioderechoid'})
Historialauditivo.belongsTo(Usuario,{foreignKey:'usuariohistorialid'})



Accionesprevias.belongsTo(Usuario,{foreignKey:'usuarioaccionespreviasid'})
Beneficiario.belongsTo(Usuario,{foreignKey:'usuariobeneficiarioid'})
//Beneficiario
Beneficiario.belongsTo(Escolaridad,{foreignKey:'escolaridadid'})
Beneficiario.belongsTo(Ocupacion,{foreignKey:'ocupacionid'})

// Donadores.belongsTo()


export{
    Companyseguros,
    Paciente,
    Titularseguridadsocial,
    Seguridadsocial,
    Usuario,
    Campaign,
    Datomedico,
    Beneficiario,
    Donadores,
    Escolaridad,
    Serviciorequerido,
    Ocupacion,
    Parentesco,
    Accionesprevias,
    Medios,
    Izquierdo,
    Derecho,
    Historialauditivo
}