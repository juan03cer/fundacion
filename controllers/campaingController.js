import {unlink} from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Companyseguros,Titularseguridadsocial,Seguridadsocial,Paciente, Usuario, Campaign} from '../models/index.js'
import { promises } from 'node:dns'


const superUsuario = async (req, res) => {

    // Leer QueryString

    const { pagina: paginaActual } = req.query
    
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/mi-sitio?pagina=1')
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
                    {model:Titularseguridadsocial,as:'titularseguridadsocial'}
                 ],
            }),
            Paciente.count({
                where: {
                    usuarioId : id
                }
            })
        ])

        res.render('admin/super', {
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
const crearCampaing = async(req,res) =>{
    //Consultar Modelo de Precio y Categorias
    const [campaingid] = await Promise.all([
        Campaign.findAll(), 
    ])

   
    res.render('admin/campaing',{
        pagina:'Registrar Campaña',
        csrfToken: req.csrfToken(),
        campaingid,
        datos:{}
    })

}

const guardar = async (req,res)=>{
    //validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [campaingid] = await Promise.all([
            Campaign.findAll(), 
        ])
    
    
       
      return  res.render('admin/campaing',{
            pagina:'Registrar Paciente',
            csrfToken: req.csrfToken(),
        
            campaingid,
            errores:resultado.array(),
            datos:req.body

        })
    }

    //Crear un registro
    const{nombre} =req.body

    try{
       await Campaign.create({
            nombre,
            
        })
 // Redirigue a paguina principal del super
 res.render('admin/super', {
   
});
    } catch(error){
        console.log(error)
    }
}

export{
    superUsuario,
    crearCampaing,
    guardar
   
    
}
