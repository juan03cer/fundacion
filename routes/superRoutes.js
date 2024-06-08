import express from 'express'
import {body} from 'express-validator'
import {superUsuario,crearCampaing,guardar,campaings} from '../controllers/campaingController.js'
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import { sendEmails, crearCorreo } from '../controllers/emailController.js';

const router = express.Router();

router.get('/mi-sitio',protegerRuta, superUsuario)


router.get('/admin/emails',protegerRuta, crearCorreo)
router.post('/admin/emails',protegerRuta, sendEmails)

router.get('/admin/email/crear',protegerRuta, )


router.get('/admin/mostrarcampaings',protegerRuta, campaings)


router.get('/admin/campaing',protegerRuta, crearCampaing)
router.post('/admin/campaing',protegerRuta,
    body('nombre').notEmpty().withMessage('El Nombre de la campaña es obligatoria'),

    guardar
)


export default router