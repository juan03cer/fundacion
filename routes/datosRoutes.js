import express from 'express'
import {completado,crearBeneficiario, datosMedicos, guardarBeneficiario,guardarDatosMedicos, mostrarDatosMedicos,editarDatoMedico,editarDatoMedicoGuardado,editarDatoBeneficiario,editarDatoBeneficiarioGuardado,mostrarDatosBeneficiario,accionesprevias,accionespreviasguardar,mostrarAccionesPrevias} from '../controllers/datosController.js'
import protegerRuta from '../middleware/protegerRuta.js';

const router =express.Router()


router.get('/pacientes/completado/:id',protegerRuta, completado)

//
router.get('/pacientes/beneficiario/:id',protegerRuta,crearBeneficiario)
router.post('/pacientes/beneficiario/:id',protegerRuta,guardarBeneficiario)
router.get('/pacientes/mostrardatosbeneficiario/:id',protegerRuta,mostrarDatosBeneficiario)
router.get('/pacientes/:pacienteId/editardatobeneficiario/:beneficiarioid',protegerRuta,editarDatoBeneficiario)
router.post('/pacientes/:pacienteId/editardatobeneficiario/:beneficiarioid',protegerRuta,editarDatoBeneficiarioGuardado)


router.get('/pacientes/datosmedicos/:id',protegerRuta,datosMedicos)
router.post('/pacientes/datosmedicos/:id',protegerRuta,guardarDatosMedicos)
router.get('/pacientes/mostrardatosmedicos/:id',protegerRuta,mostrarDatosMedicos)
router.get('/pacientes/:pacienteId/editardatomedico/:datomedicoId',protegerRuta, editarDatoMedico);
router.post('/pacientes/:pacienteId/editardatomedico/:datomedicoId',protegerRuta, editarDatoMedicoGuardado);


router.get('/pacientes/accionesprevias/:id',protegerRuta,accionesprevias)
router.post('/pacientes/accionesprevias/:id',protegerRuta,accionespreviasguardar)
router.get('/pacientes/mostraraccionesprevias/:id',protegerRuta,mostrarAccionesPrevias)



export default router