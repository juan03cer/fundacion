import express from 'express'
import {  inicio,campaign,noEncontrado,buscador,buscadorcampaing} from '../controllers/appController.js'

const router =express.Router()

//Pagina de inicio
router.get('/',inicio)

//
router.get('/campaign/:id',campaign)

router.get('/404', noEncontrado)

router.post('/buscador',buscador)
router.post('/buscadorcampaing', buscadorcampaing)


export default router