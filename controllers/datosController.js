import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator"
import {Ocupacion,Escolaridad,Serviciorequerido,Paciente, Beneficiario,Companyseguros,Seguridadsocial,Titularseguridadsocial,Usuario,Parentesco, Datomedico} from '../models/index.js'
import {esUsuario} from '../helpers/index.js'

const completado = async (req,res)=>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
      
        const paciente =await Paciente.findByPk(id,{
            include:[
                { model: Companyseguros , as:'companyseguro'},
                {model: Seguridadsocial, as:'seguridadsocial' },
                {model:Titularseguridadsocial,as:'titularseguridadsocial'},
                {model:Usuario,as:'usuario'},
                
                
            ],
        })
        if(!paciente){
            return res.redirect('/mis-pacientes')
        }
       
        res.render('pacientes/completado',{
            pagina:`Completar datos de :  ${paciente.nombre}`,
            csrfToken: req.csrfToken(),
            usuario:req.usuario,
            paciente,
            datos:{}
        })
}


const crearBeneficiario = async(req,res) =>{

    const {id} = req.params
    
//Comprobar que el paciente estista 
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo de Precio y Categorias
    const [escolaridadid,ocupacionid] = await Promise.all([
        Escolaridad.findAll(), 
        Ocupacion.findAll(),
       
    ])

   
    res.render('pacientes/beneficiario',{
        pagina:`Registrar Beneficiario del paciente:  ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        escolaridadid,
        ocupacionid,
        paciente,
        datos:{}
    })
}

const guardarBeneficiario = async (req, res) => {
  //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    const [escolaridadid,ocupacionid] = await Promise.all([
        Escolaridad.findAll(), 
        Ocupacion.findAll()
    ])

    return  res.render('pacientes/beneficiario',{
          pagina:'Registrar Paciente',
          csrfToken: req.csrfToken(),
          escolaridadid, 
          ocupacionid,
          errores:resultado.array(),
          datos:req.body

      })
  }

  //Crear un registro
  const{nombre,firma,fechanacimiento,edad,meses,escolaridadid,ocupacionid} =req.body

  const{id: usuariobeneficiarioid} =req.usuario
  try{
     const actualizarBeneficiario = await Beneficiario.create({
          nombre,
          firma,
          fechanacimiento,
          edad,
          meses,
          usuariobeneficiarioid,
          escolaridadid,
          ocupacionid,
          pacienteid: req.params.id
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { beneficiarioid: actualizarBeneficiario.id },
        { where: { id: req.params.id } }
      );

    // Redirigue a paguina principal del super
    res.render('pacientes/beneficiario', {
        csrfToken: req.csrfToken(),
          escolaridadid, 
          ocupacionid,
    });
  } catch(error){
      console.log(error)
  }
}


//formulario para crear 
const datosMedicos = async(req,res) =>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo de Precio y Categorias
    const [serviciorequeridoid] = await Promise.all([
        Serviciorequerido.findAll(),
    ])

    res.render('pacientes/datosmedicos',{
        pagina:`Registrar Datos Medicos del paciente:  ${paciente.nombre} `,
        csrfToken: req.csrfToken(),
        serviciorequeridoid,
        paciente,
        datos:{}
    })
}

const guardarDatosMedicos= async (req,res)=>{
    //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    const [serviciorequeridoid] = await Promise.all([
        Serviciorequerido.findAll(),
    ])

    return  res.render('pacientes/datosmedicos',{
          pagina:'Registrar Datos Medicos',
          csrfToken: req.csrfToken(),
          serviciorequeridoid,
          errores:resultado.array(),
          datos:req.body

      })
  }


  //Crear un registro
  const{enfermedad,ruidosonido,familiarusausado,ladoescucha,exposicion,tiporuido,diagnostico,serviciorequeridoid} =req.body

  const{id: usuariodatomedicoid} =req.usuario
  try{
     const actualizarDatoMedico = await Datomedico.create({
        enfermedad,
        ruidosonido,
        familiarusausado,
        ladoescucha,
        exposicion,
        tiporuido,
        diagnostico,
        usuariodatomedicoid,
        serviciorequeridoid,
        pacienteid: req.params.id
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { datomedicoid: actualizarDatoMedico.id },
        { where: { id: req.params.id } }
      );

    // Redirigue a paguina principal del super
    res.render('pacientes/datosmedicos', {
        csrfToken: req.csrfToken(),
        serviciorequeridoid
    });
  } catch(error){
      console.log(error)
  }
}


const mostrarDatosMedicos = async (req,res) =>{
      
    const {id} = req.params
    
    //Comprobar que el paciente exista 
        const paciente =await Paciente.findByPk(id,{
            include:[
                { model: Companyseguros , as:'companyseguro'},
                {model: Seguridadsocial, as:'seguridadsocial' },
                {model:Titularseguridadsocial,as:'titularseguridadsocial'},
                
                {model:Parentesco,as:'parentesco'},
                {
                    model: Datomedico,
                    as: 'datomedico',
                    include: [{ model: Serviciorequerido, as: 'serviciorequerido' },
                        { model:Usuario, as: 'usuario' }
                    ]
                }
                
            ],
        })
         if(!paciente || !paciente.publicado){
            return res.redirect('/404')
         }
    
    
        res.render('pacientes/mostrardatosmedicos',{
            paciente,
            pagina:'Datos Medicos del Paciente: '+paciente.nombre,
            csrfToken: req.csrfToken(),
            usuario:req.usuario,
        })
}

export{
    completado,
    crearBeneficiario,
    guardarBeneficiario,
   datosMedicos,
   guardarDatosMedicos,
   mostrarDatosMedicos
 
}
