import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Companyseguros,Titularseguridadsocial,Seguridadsocial,Paciente, Usuario ,Campaign, Parentesco, Datomedico, Beneficiario, Accionesprevias,Medios,Izquierdo,Derecho, Historialauditivo} from '../models/index.js'
import { promises } from 'node:dns'
import {esUsuario} from '../helpers/index.js'

const admin = async (req, res) => {

    // Leer QueryString

    const { pagina: paginaActual } = req.query
    
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/mis-pacientes?pagina=1')
    }

    try {
        const {id} = req.usuario

        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual * limit) - limit)

        const [paciente, total] = await Promise.all([
            Paciente.findAll({
                limit,
                offset,
                where: {
                    usuarioId : id
                },
                include: [
                    { model: Companyseguros , as:'companyseguro'},
                    {model: Seguridadsocial, as:'seguridadsocial' },
                    {model:Titularseguridadsocial,as:'titularseguridadsocial'},
                    
                   
                 ],
            }),
            Paciente.count({
                where: {
                    usuarioId : id
                }
            })
        ])

        res.render('pacientes/admin', {
            pagina: 'Pacientes Registrados',
            paciente,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })

    } catch (error) {
        console.log(error)
    }
    
}

//formulario para crear 
const crear = async(req,res) =>{
    //Consultar Modelo de Precio y Categorias
    const [companysegurosid,titularseguridadsocialid,seguridadsocialid,campaignid,parentescoid,mediosid] = await Promise.all([
        Companyseguros.findAll(),
        Titularseguridadsocial.findAll(),
        Seguridadsocial.findAll(),
        Campaign.findAll(), 
        Parentesco.findAll(),
        Medios.findAll()
    ])

   
    res.render('pacientes/crear',{
        pagina:'Registrar Paciente',
        csrfToken: req.csrfToken(),
        companysegurosid,
        titularseguridadsocialid,
        seguridadsocialid,
        campaignid,
        parentescoid,
        mediosid,
        datos:{}
    })

}

const guardar = async (req,res)=>{
    //validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [companysegurosid,titularseguridadsocialid,seguridadsocialid,campaignid,parentescoid,mediosid] = await Promise.all([
            Companyseguros.findAll(),
            Titularseguridadsocial.findAll(),
            Seguridadsocial.findAll(),
            Campaign.findAll(),
            Parentesco.findAll(),
            Medios.findAll()
            
        ])
    
       
      return  res.render('pacientes/crear',{
            pagina:'Registrar Paciente',
            csrfToken: req.csrfToken(),
            companysegurosid,
            titularseguridadsocialid,
            seguridadsocialid,
            campaignid,
            parentescoid,
            mediosid,
            errores:resultado.array(),
            datos:req.body

        })
    }

    //Crear un registro
    const{nombre,datomedico,sexo,seguridadsocialid,segdgasmdcs,companysegurosid,
        titularseguridadsocialid,campaignid,correo,numpaciente,telrecados,calle,lat,lng,
        companion,parentescoid,mediosid,telcompanion,canaldereferencia,numexpediente,fechanacimiento,edad,meses} =req.body


    const{id: usuarioid} =req.usuario

    try{
        const pacienteGuardado = await Paciente.create({
            nombre,
            datomedico,
            sexo,
            seguridadsocialid,
            segdgasmdcs,
            companysegurosid,
            titularseguridadsocialid,
            campaignid,
            correo,
            numpaciente,
            telrecados,
            calle,
            lat,
            lng,
            usuarioid,
            companion,
            parentescoid,
            mediosid,
            telcompanion,
            canaldereferencia,
            numexpediente,
            fechanacimiento,
            edad,
            meses

            
        })

        const {id} = pacienteGuardado
        res.redirect('/mis-pacientes')

    } catch(error){
        console.log(error)
    }
}

const agregarImagen = async(req,res) =>{

    const{id} =req.params

    //Validar que el paciente exista
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

    //validar que el paciente no este dado de alta
    if(paciente.publicado){
        return res.redirect('/mis-pacientes')
    }


    //validar que el paciente lo puede modificar el usuario
    if(req.usuario.id.toString() !== paciente.usuarioid.toString()){
        return res.redirect('/mis-pacientes')
    }

    res.render('pacientes/agregar-imagen',{
        pagina:`Agregar Imagen del paciente : ${paciente.nombre}`,
         csrfToken: req.csrfToken(),
         paciente,
       

    })

}

const almacenarImagen = async (req,res,next) =>{
    const{id} =req.params

    //Validar que el paciente exista
    
    const paciente =await Paciente.findByPk(id)
    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

    //validar que el paciente no este dado de alta
    if(paciente.publicado){
        return res.redirect('/mis-pacientes')
    }


    //validar que el paciente lo puede modificar el usuario
    if(req.usuario.id.toString() !== paciente.usuarioid.toString()){
        return res.redirect('/mis-pacientes')
    }

    res.render('pacientes/agregar-imagen',{
        pagina:`Agregar Imagen del paciente : ${paciente.nombre}`,
         csrfToken: req.csrfToken(),
         paciente,
       

    })

    try{
        // console.log(req.file)
        //Almacenar Imagen y Publicar paciente
        paciente.imagen = req.file.filename

        paciente.publicado = 1

        await paciente.save()
        
        next()

    } catch(error){
        console.log(error)
    }

}

const editar =async(req,res)=>{

    const{id}=req.params
    //Validar que el paciente exista
    const paciente = await Paciente.findByPk(id)

    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

    // //Revisra que quien visita la url ,es quien creo al paciente
    // if(paciente.usuarioid.toString() !== req.usuario.id.toString()){
    //     return res.redirect('/mis-pacientes')
    // }
    //Consultar Modelo de Precio y Categorias
    const [companysegurosid,titularseguridadsocialid,seguridadsocialid,campaignid,parentescoid,mediosid] = await Promise.all([
        Companyseguros.findAll(),
        Titularseguridadsocial.findAll(),
        Seguridadsocial.findAll(),
        Campaign.findAll(),
        Parentesco.findAll(),
        Medios.findAll()
        
    ])

    res.render('pacientes/editar',{
        pagina:`Editar Paciente: ${paciente.nombre}`,
        csrfToken: req.csrfToken(),
        companysegurosid,
        titularseguridadsocialid,
        seguridadsocialid,
        campaignid,
        parentescoid,
        mediosid,
        datos:paciente
    })
}

const guardarCambios= async(req,res)=>{

    //verificar la validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [companysegurosid,titularseguridadsocialid,seguridadsocialid,campaignid] = await Promise.all([
            Companyseguros.findAll(),
            Titularseguridadsocial.findAll(),
            Seguridadsocial.findAll(),
            Campaign.findAll()
            
        ])
    
       
        res.render('pacientes/editar',{
            pagina:'Editar Paciente',
            csrfToken: req.csrfToken(),
            companysegurosid,
            titularseguridadsocialid,
            seguridadsocialid,
            campaignid,
            errores:resultado.array(),
            datos:req.body
        })
    }

    const{id}=req.params
    //Validar que el paciente exista
    const paciente = await Paciente.findByPk(id)

    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

  

    //Reescribir el objeto y actualizarlo
    try{
        const{nombre,sexo,seguridadsocialid,segdgasmdcs,companysegurosid,titularseguridadsocialid,campaignid,correo,numpaciente,telrecados,calle,lat,lng,
            canaldereferencia,mediosid,numexpediente,fechanacimiento,edad,meses
        } =req.body

        const{id: usuarioid} =req.usuario
        paciente.set({
            nombre,
            sexo,
            seguridadsocialid,
            segdgasmdcs,
            companysegurosid,
            titularseguridadsocialid,
            campaignid,
            correo,
            numpaciente,
            telrecados,
            calle,
            lat,
            lng,
            canaldereferencia,
            usuarioid,
            mediosid,
            numexpediente,
            fechanacimiento,
            edad,
            meses


        })
        await paciente.save()
        res.redirect('/mis-pacientes')
    }catch(error){
        console.log(error)
    }
}

const eliminar = async (req,res) =>{
    const{id}=req.params
    //Validar que el paciente exista
    const paciente = await Paciente.findByPk(id)

    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

    // //Revisra que quien visita la url ,es quien creo al paciente
    // if(paciente.usuarioid.toString() !== req.usuario.id.toString()){
    //     return res.redirect('/mis-pacientes')
    // }

 
    //Eliminar paciente
    await paciente.destroy()
    res.redirect('/mis-pacientes')
}

//Modificar el estado del paciente

const cambiarEstado =async(req,res) =>{

    const{id}=req.params
    //Validar que el paciente exista
    const paciente = await Paciente.findByPk(id)

    if(!paciente){
        return res.redirect('/mis-pacientes')
    }

    //Revisra que quien visita la url ,es quien creo al paciente
    if(paciente.usuarioid.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-pacientes')
    }
    //Actualizar

   paciente.publicado = !paciente.publicado
   await paciente.save()
   res.json({
    resultado:true
   })

}







//mostrar Pacientes

const mostrarPaciente = async (req,res)=>{

    const {id} = req.params
    
//Comprobar que el paciente estista 
    const paciente =await Paciente.findByPk(id,{
        include:[
            { model: Companyseguros , as:'companyseguro'},
            {model: Seguridadsocial, as:'seguridadsocial' },
            {model:Titularseguridadsocial,as:'titularseguridadsocial'},
            {model:Usuario,as:'usuario'},
            {model:Parentesco,as:'parentesco'},
            {model:Datomedico,as:'datomedico'},
            {model:Beneficiario,as:'beneficiario'},
            { model: Accionesprevias, as: 'accionesprevia' } ,
            {model:Medios,as:'medio'},
            {model:Izquierdo,as:'izquierdo'},
            {model:Derecho,as:'derecho'},
            {model:Historialauditivo,as:'historialauditivo'}
            
            
            
        ],
    })
     if(!paciente || !paciente.publicado){
        return res.redirect('/404')
     }


    res.render('pacientes/mostrar',{
        paciente,
        pagina:'Datos del Paciente: '+paciente.nombre,
        csrfToken: req.csrfToken(),
        usuario:req.usuario,
        esUsuario: esUsuario(req.usuario?.id, paciente.usuarioid)
    })
}

//se termina de llenar la informacion del usuario

const mostrarPacienteApp = async (req,res)=>{

    const {id} = req.params
    
//Comprobar que el paciente estista 
    const paciente =await Paciente.findByPk(id,{
        include:[
            { model: Companyseguros , as:'companyseguro'},
            {model: Seguridadsocial, as:'seguridadsocial' },
            {model:Titularseguridadsocial,as:'titularseguridadsocial'},
            {model:Usuario,as:'usuario'},
            {model:Datomedico,as:'datomedico'},
            {model:Beneficiario,as:'beneficiario'},
            { model: Accionesprevias, as: 'accionesprevia' } ,
            {model:Medios,as:'medios'},
            {model:Izquierdo,as:'izquierdo'},
            {model:Derecho,as:'derecho'},
            {model:Historialauditivo,as:'historialauditivo'}
            
            
        ],
    })
     if(!paciente || !paciente.publicado){
        return res.redirect('/404')
     }


    res.render('pacientes/mostrarapp',{
        paciente,
        pagina:paciente.nombre,
        csrfToken: req.csrfToken(),
        usuario:req.usuario,
        esUsuario: esUsuario(req.usuario?.id, paciente.usuarioid)
    })
}

const mostrarcampaings = async (req, res) => {
    try {
        const campaings = await Campaign.findAll();
        
        res.render('sitio/campaings', {
            campaings,
            csrfToken: req.csrfToken(),
            pagina:'campañas'
        });
    } catch (error) {
        console.render('/404')
    }
};


export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
  mostrarPaciente,
  mostrarcampaings,
  mostrarPacienteApp

    
}
