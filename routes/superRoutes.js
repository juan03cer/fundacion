import express from 'express'
import {body} from 'express-validator'
import {superUsuario,crearCampaing,guardar} from '../controllers/campaingController.js'
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';

const router = express.Router();

router.get('/mi-sitio',protegerRuta, superUsuario)


router.get('/admin/campaing',protegerRuta, crearCampaing)
router.post('/admin/campaing',protegerRuta,
    body('nombre').notEmpty().withMessage('El Nombre de la campaña es obligatoria'),

    guardar
)


// router.get('/pacientes/agregar-imagen/:id',protegerRuta,agregarImagen)
// router.post('/pacientes/agregar-imagen/:id',
//  protegerRuta,
//     upload.single('imagen'),
//     almacenarImagen
// )

// router.get('/pacientes/editar/:id',protegerRuta,editar)
// router.post('/pacientes/editar/:id',protegerRuta,
//     body('nombre').notEmpty().withMessage('El Nombre es obligatorio'),
//     body('datomedico').notEmpty().withMessage('El datos medico es obligatorio'),
//     body('correo').notEmpty().withMessage('El Correo es obligatorio'),
//     body('lat').notEmpty().withMessage('Ubica la direccion del paciente en el mapa'),
// guardarCambios
// )

// router.post('/pacientes/eliminar/:id',
//     protegerRuta,
//     eliminar
// )

// // Area publica
// router.get('/pacientes/:id',mostrarPaciente)

export default router