import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator"
import {Ocupacion,Escolaridad,Serviciorequerido,Paciente, Beneficiario,Companyseguros,Seguridadsocial,Titularseguridadsocial,Usuario,Parentesco, Datomedico} from '../models/index.js'
import {esUsuario} from '../helpers/index.js'
import Accionesprevias from '../models/Accionesprevias.js'

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

      res.redirect(`/pacientes/mostrardatosbeneficiario/${req.params.id}`);
  } catch(error){
      console.log(error)
  }
}

const mostrarDatosBeneficiario = async(req,res)=>{
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [
            { model: Companyseguros, as: 'companyseguro' },
            { model: Seguridadsocial, as: 'seguridadsocial' },
            { model: Titularseguridadsocial, as: 'titularseguridadsocial' },
            { model: Parentesco, as: 'parentesco' },
            {model:Datomedico,as:'datomedico'},
            {
                model: Beneficiario, as: 'beneficiario',
                include: [
                    { model: Escolaridad, as: 'escolaridad' },
                    { model: Ocupacion, as: 'ocupacion' },
                    { model: Usuario, as: 'usuario' }
                ]
            }
        ],
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const beneficiarioId = pacienteId.beneficiario ? pacienteId.beneficiario.id : null;


    res.render('pacientes/mostrardatosbeneficiario', {
        pacienteId,
        pagina: 'Datos del beneficiario del paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        beneficiarioId
    });
}



const editarDatoBeneficiario = async(req,res) =>{
    const { pacienteId, beneficiarioid } = req.params;

    // Buscar el paciente y los datos médicos asociados
    const paciente = await Paciente.findByPk(pacienteId);
    if (!paciente) {
        return res.redirect('/mis-pacientes');
    }

    const beneficiario = await Beneficiario.findByPk(beneficiarioid);
    if (!beneficiario) {
        return res.redirect('/mis-pacientes');
    }

       //Consultar Modelo de Precio y Categorias
       const [escolaridadid,ocupacionid] = await Promise.all([
        Escolaridad.findAll(), 
        Ocupacion.findAll(),
       
    ])
    res.render('pacientes/editardatobeneficiario', {
        pagina: `Editar Datos Médicos del paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        escolaridadid,
        ocupacionid,
        paciente,
        datos: beneficiario
    });
}

const editarDatoBeneficiarioGuardado = async(req,res) =>{
    const { pacienteId, beneficiarioid } = req.params;
    // Validación
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {

        const [escolaridadid,ocupacionid] = await Promise.all([
            Escolaridad.findAll(), 
            Ocupacion.findAll(),
           
        ])
        return res.render('pacientes/editardatobeneficiario', {
            pagina: `Editar Datos Del Beneficiario`,
            csrfToken: req.csrfToken(),
            escolaridadid,
            ocupacionid,
            errores: resultado.array(),
            datos: req.body,
            paciente: await Paciente.findByPk(pacienteId) 
        });
    }
    
  //Crear un registro
  const{nombre,firma,fechanacimiento,edad,meses,escolaridadid,ocupacionid} =req.body

  const{id: usuariobeneficiarioid} =req.usuario

  try{
     // Buscar el dato beneficiario para actualizar
     const beneficiario = await Beneficiario.findByPk(beneficiarioid);
     if (!beneficiario) {
         return res.redirect('/mis-pacientes');
     }
      await beneficiario.update({
        nombre,
        firma,
        fechanacimiento,
        edad,meses,
        escolaridadid,
        ocupacionid,
        usuariobeneficiarioid
         
      });

    // Redirigue a paguina principal del super
    res.redirect(`/pacientes/mostrardatosbeneficiario/${pacienteId}`);
  } catch(error){
      res.render('/404')
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
  const{enfermedad,ruidosonido,familiarusausado,ladoescucha,exposicion,tiporuido,diagnostico,serviciorequeridoid,otorrino,audiologo,terapeuta,ingresaraudiometria} =req.body

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
        pacienteid: req.params.id,
        otorrino,
        audiologo,
        terapeuta,
        ingresaraudiometria
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { datomedicoid: actualizarDatoMedico.id },
        { where: { id: req.params.id } }
      );

      res.redirect(`/pacientes/mostrardatosmedicos/${req.params.id}`);
  } catch(error){
    //   res.render('/404')
    console.log(error)
  }
}


// Mostrar formulario de edición
const editarDatoMedico = async (req, res) => {
    const { pacienteId, datomedicoId } = req.params;

    // Buscar el paciente y los datos médicos asociados
    const paciente = await Paciente.findByPk(pacienteId);
    if (!paciente) {
        return res.redirect('/mis-pacientes');
    }

    const datomedico = await Datomedico.findByPk(datomedicoId);
    if (!datomedico) {
        return res.redirect('/mis-pacientes');
    }

    // Consultar modelo de servicios requeridos
    const serviciorequeridoid = await Serviciorequerido.findAll();

    res.render('pacientes/editardatomedico', {
        pagina: `Editar Datos Médicos del paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        serviciorequeridoid,
        paciente,
        datos: datomedico // Asegúrate de que datos contenga los campos necesarios, como enfermedad y ruidosonido
    });
};


const editarDatoMedicoGuardado = async (req, res) => {
    const { pacienteId, datomedicoId } = req.params;

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const serviciorequeridoid = await Serviciorequerido.findAll();
        return res.render('pacientes/editardatomedico', {
            pagina: `Editar Datos Médicos`,
            csrfToken: req.csrfToken(),
            serviciorequeridoid,
            errores: resultado.array(),
            datos: req.body,
            paciente: await Paciente.findByPk(pacienteId) 
        });
    }

    const { enfermedad, ruidosonido, familiarusausado, ladoescucha, exposicion, tiporuido, diagnostico, serviciorequeridoid ,otorrino,audiologo,terapeuta,ingresaraudiometria} = req.body;
    const { id: usuariodatomedicoid } = req.usuario;

    try {
        // Buscar el dato médico para actualizar
        const datomedico = await Datomedico.findByPk(datomedicoId);
        if (!datomedico) {
            return res.redirect('/mis-pacientes');
        }

        // Actualizar los datos médicos
        await datomedico.update({
            enfermedad,
            ruidosonido,
            familiarusausado,
            ladoescucha,
            exposicion,
            tiporuido,
            diagnostico,
            usuariodatomedicoid,
            serviciorequeridoid,
            pacienteid: pacienteId,
            otorrino,
            audiologo,
            terapeuta,
            ingresaraudiometria
        });

        // Redirigir a la página principal de datos medicos del paciente
        res.redirect(`/pacientes/mostrardatosmedicos/${pacienteId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/404');
    }
};



const mostrarDatosMedicos = async (req, res) => {
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [
            { model: Companyseguros, as: 'companyseguro' },
            { model: Seguridadsocial, as: 'seguridadsocial' },
            { model: Titularseguridadsocial, as: 'titularseguridadsocial' },
            { model: Parentesco, as: 'parentesco' },
            {model:Beneficiario,as:'beneficiario'},
            {
                model: Datomedico, as: 'datomedico',
                include: [
                    { model: Serviciorequerido, as: 'serviciorequerido' },
                    { model: Usuario, as: 'usuario' }
                ]
            }
        ],
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const datomedicoId = pacienteId.datomedico ? pacienteId.datomedico.id : null;

    res.render('pacientes/mostrardatosmedicos', {
        pacienteId,
        pagina: 'Datos Medicos del Paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        datomedicoId // Pasamos el ID del dato médico para crear el enlace de edición
    });
}

const accionesprevias= async(req,res)=>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
    const pacienteId =await Paciente.findByPk(id)
    if(!pacienteId){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo 
    const [serviciorequeridoid] = await Promise.all([
        Serviciorequerido.findAll(),
    ])

    res.render('pacientes/accionesprevias',{
        pagina:`Registrar Datos Medicos del paciente:  ${pacienteId.nombre} `,
        csrfToken: req.csrfToken(),
        serviciorequeridoid,
        pacienteId,
        datos:{}
    })
}
const accionespreviasguardar =async(req,res)=> {
  //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
  

    return  res.render('pacientes/accionesprevias',{
          pagina:'Registrar Acciones Previas',
          csrfToken: req.csrfToken(),
          errores:resultado.array(),
          datos:req.body

      })
  }


  //Crear un registro
  const{empresaimplante,marcas,cotizacion,centroimplante,contacto,cualcontacto,apoyo,quien,prevencioneconomica,campaignrecaudacion} =req.body

  const{id: usuarioaccionespreviasid} =req.usuario
  try{
     const actualizarAccionesPrevias = await Accionesprevias.create({
        empresaimplante,
        marcas,
        cotizacion,
        centroimplante,
        contacto,
        cualcontacto,
        apoyo,
        usuarioaccionespreviasid,
        quien,
        prevencioneconomica,
        campaignrecaudacion
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { accionespreviasid: actualizarAccionesPrevias.id },
        { where: { id: req.params.id } }
      );

    // Redirigue a paguina principal del super
    res.redirect(`/pacientes/mostraraccionesprevias/${req.params.id}`)
  } catch(error){
      console.log(error)
  }
}

const mostrarAccionesPrevias = async(req,res) =>{
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [
            {model:Beneficiario,as:'beneficiario'},
            {
                model: Accionesprevias, as: 'accionesprevia',
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
              
            } 
        ]
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const accionespreviasId = pacienteId.accionesprevias ? pacienteId.accionesprevias.id : null;

    res.render('pacientes/mostraraccionesprevias', {
        pacienteId,
        pagina: 'Acciones previas del paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        accionespreviasId 
    });
}



export{
    completado,
    crearBeneficiario,
    guardarBeneficiario,
    editarDatoBeneficiario,
    editarDatoBeneficiarioGuardado,
    mostrarDatosBeneficiario,
   datosMedicos,
   guardarDatosMedicos,
   mostrarDatosMedicos,
   editarDatoMedico,
editarDatoMedicoGuardado,
accionesprevias,
accionespreviasguardar,
mostrarAccionesPrevias

 
}
