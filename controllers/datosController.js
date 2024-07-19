import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator"
import xlsx from "xlsx"

import {Ocupacion,Escolaridad,Serviciorequerido,Paciente, Beneficiario,Companyseguros,
    Seguridadsocial,Titularseguridadsocial,Usuario,Parentesco, Datomedico,Izquierdo,Derecho,
    Historialauditivo,
    Campaign,
    Medios} from '../models/index.js'
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
        pagina:`Registrar de Datos Extras del Paciente:  ${paciente.nombre}`,
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

const oidoIzquierdo = async (req,res) =>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo de Precio y Categorias
    res.render('pacientes/audiometria/oidoizquierdo',{
        pagina:`Registrar datos dedicos de la audiometria en el oido Izquierdo:  ${paciente.nombre} `,
        csrfToken: req.csrfToken(),
        paciente,
        datos:{}
    })
}
const oidoIzquierdoGuardar = async (req,res) =>{
  //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    return  res.render('pacientes/audiometria/oidoizquierdo',{
          pagina:`Registrar datos dedicos de la audiometria en el oido Izquierdo:  ${paciente.nombre} `,
          csrfToken: req.csrfToken(),
          errores:resultado.array(),
          datos:req.body

      })
  }


  //Crear un registro
  const{fecha,tipo,oido,umbral,gradoperdida,configuracion,patronperdida,observaciones,recomendacion,nombre} =req.body

  const{id: usuarioizquierdoid} =req.usuario
  try{
     const actualizarOidoIzquierdo = await Izquierdo.create({
        fecha,
        tipo,
        oido,
        umbral,
        gradoperdida,
        configuracion,
        patronperdida,
        observaciones,
        recomendacion,nombre,
        usuarioizquierdoid,
        pacienteid: req.params.id,
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { izquierdoid: actualizarOidoIzquierdo.id },
        { where: { id: req.params.id } }
      );

      res.redirect(`/pacientes/audiometria/oidoizquierdomostrar/${req.params.id}`);
  } catch(error){
    //   res.render('/404')
    console.log(error)
  }
}
const oidoIzquierdoMostrar = async (req,res) =>{
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [  
            { model: Datomedico, as: 'datomedico' },
            {model:Derecho,as:'derecho'},
            {
                model: Izquierdo, as: 'izquierdo',
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
            }
        
        ],
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const izquierdo = pacienteId.izquierdo;


    res.render('pacientes/audiometria/oidoizquierdomostrar', {
        pacienteId,
        pagina: 'Datos Medicos Del Oido Izquierdo del Paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        izquierdo
    });
}

const oidoIzquierdoEditar = async (req,res) =>{
    const { pacienteId, izquierdoId } = req.params;

    // Buscar el paciente y los datos médicos asociados
    const paciente = await Paciente.findByPk(pacienteId);
    if (!paciente) {
        return res.redirect('/mis-pacientes');
    }

    const izquierdo = await Izquierdo.findByPk(izquierdoId);
    if (!izquierdo) {
        return res.redirect('/mis-pacientes');
    }


    res.render('pacientes/audiometria/oidoizquierdoeditar', {
        pagina: `Editar Datos Médicos del Oido Izquierdo del Paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        paciente,
        datos: izquierdo 
    });
}
const oidoIzquierdoEditarGuardar = async (req,res) =>{
    const { pacienteId, izquierdoId } = req.params;

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render('pacientes/audiometria/oidoizquierdoeditar', {
            pagina: `Editar Datos Medicos del Oido Izquierdo`,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            paciente: await Paciente.findByPk(pacienteId) 
        });
    }
    const{fecha,tipo,oido,umbral,gradoperdida,configuracion,patronperdida,observaciones,recomendacion,nombre} =req.body

    const{id: usuarioizquierdoid} =req.usuario
    try {
        // Buscar el dato médico para actualizar
        const izquierdo = await Izquierdo.findByPk(izquierdoId);
        if (!izquierdo) {
            return res.redirect('/mis-pacientes');
        }

        // Actualizar los datos médicos
        await izquierdo.update({
            fecha,
            tipo,
            oido,
            umbral,
            gradoperdida,
            configuracion,
            patronperdida,
            observaciones,
            recomendacion,nombre,
            usuarioizquierdoid,
            pacienteid: req.params.id,
        });

        // Redirigir a la página principal de datos medicos del paciente
        res.redirect(`/pacientes/audiometria/oidoizquierdomostrar/${pacienteId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/404');
    }
}

const oidoDerecho = async (req,res) =>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo de Precio y Categorias
    res.render('pacientes/audiometria/oidoderecho',{
        pagina:`Registrar datos dedicos de la audiometria en el oido Derecho:  ${paciente.nombre} `,
        csrfToken: req.csrfToken(),
        paciente,
        datos:{}
    })
}
const oidoDerechoGuardar= async (req,res) =>{
     //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    return  res.render('pacientes/audiometria/oidoderecho',{
          pagina:`Registrar datos dedicos de la audiometria en el oido Derecho:  ${paciente.nombre} `,
          csrfToken: req.csrfToken(),
          errores:resultado.array(),
          datos:req.body

      })
  }


  //Crear un registro
  const{fecha,tipo,oido,umbral,gradoperdida,configuracion,patronperdida,observaciones,recomendacion,nombre} =req.body

  const{id: usuarioderechoid} =req.usuario
  try{
     const actualizarOidoDerecho = await Derecho.create({
        fecha,
        tipo,
        oido,
        umbral,
        gradoperdida,
        configuracion,
        patronperdida,
        observaciones,
        recomendacion,nombre,
        usuarioderechoid,
        pacienteid: req.params.id,
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { derechoid: actualizarOidoDerecho.id },
        { where: { id: req.params.id } }
      );

      res.redirect(`/pacientes/audiometria/oidoderechomostrar/${req.params.id}`);
  } catch(error){
    //   res.render('/404')
    console.log(error)
  }
}
const oidoDerechoMostrar = async (req,res) =>{
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [  
            { model: Datomedico, as: 'datomedico' },
            {model:Izquierdo,as:'izquierdo'},
            {
                model: Derecho, as: 'derecho',
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
            }
        
        ],
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const derecho = pacienteId.derecho;

    res.render('pacientes/audiometria/oidoderechomostrar', {
        pacienteId,
        pagina: 'Datos Medicos Del Oido Derecho del Paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        derecho
    });
}
const oidoDerechoEditar = async (req,res) =>{
    const { pacienteId, derechoId } = req.params;

    // Buscar el paciente y los datos médicos asociados
    const paciente = await Paciente.findByPk(pacienteId);
    if (!paciente) {
        return res.redirect('/mis-pacientes');
    }

    const derecho = await Derecho.findByPk(derechoId);
    if (!derecho) {
        return res.redirect('/mis-pacientes');
    }


    res.render('pacientes/audiometria/oidoderechoeditar', {
        pagina: `Editar Datos Médicos del Oido Derecho del Paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        paciente,
        datos: derecho 
    });
}
const oidoDerechoEditarGuardar = async (req,res) =>{
    const { pacienteId, derechoId } = req.params;

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render('pacientes/audiometria/oidoderechooeditar', {
            pagina: `Editar Datos Medicos del Oido Derecho`,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            paciente: await Paciente.findByPk(pacienteId) 
        });
    }
    const{fecha,tipo,oido,umbral,gradoperdida,configuracion,patronperdida,observaciones,recomendacion,nombre} =req.body

    const{id: usuarioderechoid} =req.usuario
    try {
        // Buscar el dato médico para actualizar
        const derecho = await Derecho.findByPk(derechoId);
        if (!derecho) {
            return res.redirect('/mis-pacientes');
        }

        // Actualizar los datos médicos
        await derecho.update({
            fecha,
            tipo,
            oido,
            umbral,
            gradoperdida,
            configuracion,
            patronperdida,
            observaciones,
            recomendacion,nombre,
            usuarioderechoid,
            pacienteid: req.params.id,
        });

        // Redirigir a la página principal de datos medicos del paciente
        res.redirect(`/pacientes/audiometria/oidoderechomostrar/${pacienteId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/404');
    }
}


const historialMedico= async(req,res) =>{
    const {id} = req.params
    
    //Comprobar que el paciente extista 
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }
    //Consultar Modelo de Precio y Categorias
    res.render('pacientes/historial',{
        pagina:`Registrar Historial de Datos Medico del Paciente:  ${paciente.nombre} `,
        csrfToken: req.csrfToken(),
        paciente,
        datos:{}
    })
}
const historialMedicoGuardar= async(req,res) =>{
       //validacion
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    return  res.render('pacientes/historial',{
          pagina:`Registrar Historial de Datos Medico del Paciente:  ${paciente.nombre} `,
          csrfToken: req.csrfToken(),
          errores:resultado.array(),
          datos:req.body

      })
  }


  //Crear un registro
  const{antecedentes,factores,problemas,familiares,expuesto,proteccion,infecciones,cirugia,medicamentos,covid,
    dificultades,volumen,zumbidos,sonidos,sufrido,episodios,musica,habitos,sustancias,tabaco,conversaciones,murmurar,
    situaciones,audicion,pruebaauditiva,resultadoh,consultado,diagnostico
  } =req.body

  const{id: usuariohistorialid} =req.usuario
  try{
     const actualizarHistorial = await Historialauditivo.create({
        antecedentes,factores,problemas,familiares,expuesto,proteccion,infecciones,cirugia,medicamentos,covid,
        dificultades,volumen,zumbidos,sonidos,sufrido,episodios,musica,habitos,sustancias,tabaco,conversaciones,murmurar,
        situaciones,audicion,pruebaauditiva,resultadoh,consultado,diagnostico,
        usuariohistorialid,
        pacienteid: req.params.id,
         
      });

       // Actualizar la tabla Paciente con el beneficiarioid
    await Paciente.update(
        { historialauditivoid: actualizarHistorial.id },
        { where: { id: req.params.id } }
      );

      res.redirect(`/pacientes/historialmostrar/${req.params.id}`);
  } catch(error){
    //  res.render('/404')
    console.log(error)
  }
}
const historialMedicoMostrar= async(req,res) =>{
    const { id } = req.params;

    // Comprobar que el paciente exista 
    const pacienteId = await Paciente.findByPk(id, {
        include: [  
            {model:Izquierdo,as:'izquierdo'},
            {
                model: Historialauditivo, as: 'historialauditivo',
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
            }
        
        ],
    });

    if (!pacienteId || !pacienteId.publicado) {
        return res.redirect('/404');
    }

    // Asegúrate de que exista algún dato médico asociado al pacienteId
    const historialauditivo = pacienteId.historialauditivo;

    res.render('pacientes/historialmostrar', {
        pacienteId,
        pagina: 'Datos del Historial del Paciente: ' + pacienteId.nombre,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        historialauditivo
    });
}
const historialMedicoEditar= async(req,res) =>{
    const { pacienteId, historialId } = req.params;

    // Buscar el paciente y los datos médicos asociados
    const paciente = await Paciente.findByPk(pacienteId);
    if (!paciente) {
        return res.redirect('/mis-pacientes');
    }

    const historial = await Historialauditivo.findByPk(historialId);
    if (!historial) {
        return res.redirect('/mis-pacientes');
    }


    res.render('pacientes/historialeditar', {
        pagina: `Editar Historial de Datos del Paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        paciente,
        datos: historial 
    });
}
const historialMedicoEditarGuardar= async(req,res) =>{
    const { pacienteId, historialId } = req.params;

    // Validación
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render('pacientes/historialeditar', {
            pagina: `Editar Historial de Datos del Paciente: `,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            paciente: await Paciente.findByPk(pacienteId) 
        });
    }
    const{antecedentes,factores,problemas,familiares,expuesto,proteccion,infecciones,cirugia,medicamentos,covid,
        dificultades,volumen,zumbidos,sonidos,sufrido,episodios,musica,habitos,sustancias,tabaco,conversaciones,murmurar,
        situaciones,audicion,pruebaauditiva,resultadoh,consultado,diagnostico
      } =req.body

      const{id: usuariohistorialid} =req.usuario
    try {
        // Buscar el dato médico para actualizar
        const historial = await Historialauditivo.findByPk(historialId);
        if (!historial) {
            return res.redirect('/mis-pacientes');
        }

        // Actualizar los datos médicos
        await historial.update({
            antecedentes,factores,problemas,familiares,expuesto,proteccion,infecciones,cirugia,medicamentos,covid,
            dificultades,volumen,zumbidos,sonidos,sufrido,episodios,musica,habitos,sustancias,tabaco,conversaciones,murmurar,
            situaciones,audicion,pruebaauditiva,resultadoh,consultado,diagnostico,
            usuariohistorialid,
            pacienteid: req.params.id,
        });

        // Redirigir a la página principal de datos medicos del paciente
        res.redirect(`/pacientes/historialmostrar/${pacienteId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/404');
    }
}
const pacienteExcel = async (req, res) => {
    const { id } = req.params;

    try {
        // Consultar Modelo
        const pacienteId = await Paciente.findByPk(id, {
            include: [
                { model: Seguridadsocial, as: 'seguridadsocial' },
                { model: Companyseguros, as: 'companyseguro' },
                { model: Usuario, as: 'usuario' },
                { model: Campaign, as: 'campaign' },
                { model: Datomedico, as: 'datomedico' },
                { model: Izquierdo, as: 'izquierdo' },
                { model: Derecho, as: 'derecho' },
                { model: Beneficiario, as: 'beneficiario' },
                { model: Medios, as: 'medio' },
                { model: Parentesco, as: 'parentesco' },
                { model: Accionesprevias, as: 'accionesprevia' },
                { model: Historialauditivo, as: 'historialauditivo' }
            ],
        });

        if (!pacienteId) {
            return res.status(404).send('Paciente no encontrado');
        }

        // Crear datos para Excel
        const data = [{
            'ID': pacienteId.id,
            'Nombre': pacienteId.nombre,
            'Sexo': pacienteId.sexo,
            'Correo': pacienteId.correo,
            'Fecha de Nacimiento':pacienteId.fechanacimiento,
            'Numero del Paciente': pacienteId.numpaciente,
            'Telefono para Recados': pacienteId.telrecados,
            'Seguridad Social': pacienteId.seguridadsocial?.nombre,
            'Compañia de seguros': pacienteId.companyseguro?.nombre,
            'Nombre del acompañante': pacienteId.companion,
            'Telefono del acompañante': pacienteId.telcompanion,
            'Parentesco del Acompañante':pacienteId.parentesco?.nombre,
            'Campaña en la que se conocio al paciente':pacienteId.campaign?.nombre
        }];

        // Crear un nuevo libro de trabajo
        const workbook = xlsx.utils.book_new();
        
        // Convertir los datos en una hoja de trabajo
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Agregar la hoja al libro
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Paciente');

        // Escribir el libro a un archivo
        const filePath = `./public/paciente_${pacienteId.id}.xlsx`;
        xlsx.writeFile(workbook, filePath);

        // Descargar el archivo
        res.download(filePath, `paciente_${pacienteId.nombre}.xlsx`);

    } catch (error) {
        console.error('Error al generar el archivo Excel:', error);
        res.status(500).send('Error del servidor');
    }
};

const exportarPacientesExcel = async (req, res) => {
    const { campaignId } = req.params;

    try {
        // Obtener pacientes de la campaña seleccionada
        const pacientes = await Paciente.findAll({
            include: [
                { model: Campaign, as: 'campaign', where: { id: campaignId } },
                { model: Seguridadsocial, as: 'seguridadsocial' },
                { model: Companyseguros, as: 'companyseguro' },
                { model: Usuario, as: 'usuario' },
                { model: Datomedico, as: 'datomedico' },
                { model: Izquierdo, as: 'izquierdo' },
                { model: Derecho, as: 'derecho' },
                { model: Beneficiario, as: 'beneficiario' },
                { model: Medios, as: 'medio' },
                { model: Parentesco, as: 'parentesco' },
                { model: Accionesprevias, as: 'accionesprevias' },
                { model: Historialauditivo, as: 'historialauditivo' }
            ],
        });

        // Formatear los datos para Excel
        const data = pacientes.map(paciente => ({
            'ID': paciente.id,
            'Nombre': paciente.nombre,
            'Sexo': paciente.sexo,
            'Correo': paciente.correo,
            'Fecha de Nacimiento':paciente.fechanacimiento,
            'Numero del Paciente': paciente.numpaciente,
            'Telefono para Recados': paciente.telrecados,
            'Seguridad Social': paciente.seguridadsocial?.nombre,
        }));

        const workbook = xlsx.utils.book_new();

        const worksheet = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Pacientes');

        const filePath = `./public/pacientes_campania_${campaignId}.xlsx`;
        xlsx.writeFile(workbook, filePath);

        res.download(filePath, `pacientes_campania_${campaignId}.xlsx`);

    } catch (error) {
        res.redirect(404)
    }
};


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
mostrarAccionesPrevias,
oidoIzquierdo,
oidoIzquierdoGuardar,
oidoIzquierdoMostrar,
oidoIzquierdoEditar,
oidoIzquierdoEditarGuardar,
oidoDerecho,
oidoDerechoGuardar,
oidoDerechoMostrar,
oidoDerechoEditar,
oidoDerechoEditarGuardar,
historialMedico,
historialMedicoGuardar,
historialMedicoMostrar,
historialMedicoEditar,
historialMedicoEditarGuardar,
pacienteExcel,
exportarPacientesExcel

 
}
