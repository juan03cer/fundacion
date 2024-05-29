import { Sequelize } from 'sequelize'
import {Companyseguros, Paciente,Campaign} from '../models/index.js'

const inicio = async (req, res )=>{

    const [campaign,companyseguro,paciente] = await Promise.all([
        Campaign.findAll(),
        Companyseguros.findAll(),
        Paciente.findAll({
            limit:10,
            
            include:[
                {
                    model:Campaign,as:'campaign'
                }
            ],
            order:[
                ['createdAt','DESC']
            ]
        })
    ])

    // console.log(companyseguro)
    res.render('inicio',{
        pagina:'Inicio',
        campaign,
        companyseguro,
        paciente,
        csrfToken: req.csrfToken()

    })
    }

const campaign =(req,res) =>{
    const{id}= req.params
}

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador= async (req,res)=>{
    const{termino} =req.body

    //validar que el termino no este vacio
    if(!termino.trim()){
       return req.redirect('back')
    }
    const paciente = await Paciente.findAll({
        where:{
            nombre:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include:[
            {model:Campaign,as:'campaign'}
        ]
    })
    res.render('busqueda',{
        pagina:'Resultados de la busqueda',
        paciente,
        csrfToken: req.csrfToken()
    })

}

export{
    inicio,
    campaign,
    noEncontrado,
    buscador
}