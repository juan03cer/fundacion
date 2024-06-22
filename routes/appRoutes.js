import express from 'express'
import {  inicio,campaign,noEncontrado,buscador,buscadorcampaing,inicioprincipal} from '../controllers/appController.js'
import protegerRuta from '../middleware/protegerRuta.js';
const router =express.Router()

//Pagina de inicio
router.get('/',protegerRuta,inicio)


router.get('/campaign/:id',protegerRuta,campaign)

router.get('/404',protegerRuta, noEncontrado)

router.post('/buscador',protegerRuta,buscador)
router.post('/buscadorcampaing',protegerRuta, buscadorcampaing)


export default router