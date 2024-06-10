// controllers/emailController.js
/* const nodemailer = require('nodemailer');
const User = require('../models/Donadores'); */
import nodemailer from 'nodemailer';
import Donadores from '../models/Donadores.js';
import { validationResult } from 'express-validator';

const sendEmails = async (req, res) => {
  const { subject, message, alias } = req.body;

  try {
    const users = await Donadores.findAll();

    if (!users.length) {
        return res.status(404).render('admin/emailForm', {
            pagina: 'Enviar Correos Masivos',
            csrfToken: req.csrfToken(),
            datos: req.body,
            errores: [{ msg: 'No hay usuario en la Base de datos' }],
            mensajes: []
          });
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail', // o el servicio que estés usando
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   /*  let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true para usar SSL/TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }); */

    users.forEach(Donadores => {
      let mailOptions = {
        from: `"${alias}" <${process.env.EMAIL_USER}>`,
        to: Donadores.gmaildonador,
        subject: subject,
        text: message,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending to ${Donadores.gmaildonador}: ${error}`);
        } else {
          console.log(`Email sent to ${Donadores.gmaildonador}: ${info.response}`);
        }
      });
    });

    res.render('admin/emailForm', {
        pagina: 'Enviar Correos Masivos',
        csrfToken: req.csrfToken(),
        datos: {},
        errores: [],
        mensajes: [{ msg: 'Emails enviados Correctamente' }]
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).render('admin/emailForm', {
        pagina: 'Enviar Correos Masivos',
        csrfToken: req.csrfToken(),
        datos: req.body,
        errores: [{ msg: 'Internal server error' }],
        mensajes: []        
      });
    }
};

const crearCorreo = async(req,res) =>{
   res.render('admin/emailForm',{
        pagina: 'Enviar Correos Masivos',
        csrfToken: req.csrfToken(), // usandp CSRF Proteccion
        datos:{},  // Otros datos que quieras pasar
        errores: [],//pasa una lista de errores incialemnte
        mensajes: [] 
   });
};

const crearDonador = async (req, res) => {
  res.render('admin/addDonador', {
      pagina: 'Agregar a Lista de Correos',
      csrfToken: req.csrfToken(),
      datos: {}, // Datos iniciales
      errores: [],//pasa una lista de errores incialemnte
      mensajes: []
  });
};

const guardarDonador = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.render('admin/addDonorForm', {
          pagina: 'Agregar a Lista de Correos',
          csrfToken: req.csrfToken(),
          datos: req.body,
          errores: errors.array()
      });
  }

  try {
      await Donadores.create(req.body);
      res.redirect('/admin/emails'); // Redirige a la página de correos después de agregar el donador
  } catch (error) {
      console.error('Error al guardar el donador:', error);
      res.render('admin/addDonorForm', {
          pagina: 'Agregar a Lista de Correos',
          csrfToken: req.csrfToken(),
          datos: req.body,
          errores: [{ msg: 'Error al guardar el donador' }]
      });
  }
};

const mostrarDonadores = async (req, res) => {
  try {
    const donadores = await Donadores.findAll();
    res.render('admin/verDonadores', {
      pagina: 'Lista de Donadores',
      donadores
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).render('admin/verDonadores', {
      pagina: 'Lista de Donadores',
      errores: [{ msg: 'Internal server error' }],
      donadores: []
    });
  }
};


const eliminarDonador = async (req, res) => {
  try {
    await Donadores.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/donadores/ver');
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).render('admin/verDonadores', {
      pagina: 'Lista de Donadores',
      errores: [{ msg: 'Error deleting donor' }],
      donadores: []
    });
  }
};

const editarDonador = async (req, res) => {
  try {
    const donador = await Donadores.findByPk(req.params.id);
    if (!donador) {
      return res.status(404).render('admin/verDonadores', {
        pagina: 'Lista de Donadores',
        errores: [{ msg: 'Donador no encontrado' }],
        donadores: []
      });
    }

    res.render('admin/editDonador', {
      pagina: 'Editar Donador',
      csrfToken: req.csrfToken(),
      datos: donador,
      errores: [],
      mensajes: []
    });
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).render('admin/verDonadores', {
      pagina: 'Lista de Donadores',
      errores: [{ msg: 'Error fetching donor' }],
      donadores: []
    });
  }
};

const actualizarDonador = async (req, res) => {
  const { nombre, gmaildonador, telefono, telcontacto, empresa, montodonado } = req.body;

  try {
    const donador = await Donadores.findByPk(req.params.id);
    if (!donador) {
      return res.status(404).render('admin/verDonadores', {
        pagina: 'Lista de Donadores',
        errores: [{ msg: 'Donador no encontrado' }],
        donadores: []
      });
    }

    donador.nombre = nombre;
    donador.gmaildonador = gmaildonador;
    donador.telefono = telefono;
    donador.telcontacto = telcontacto;
    donador.empresa = empresa;
    donador.montodonado = montodonado;
    await donador.save();

    res.redirect('/admin/donadores/ver');
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).render('admin/editDonador', {
      pagina: 'Editar Donador',
      csrfToken: req.csrfToken(),
      datos: req.body,
      errores: [{ msg: 'Error updating donor' }],
      mensajes: []
    });
  }
};

export{
    crearCorreo,
    sendEmails,
    crearDonador,
    guardarDonador,
    mostrarDonadores,
    eliminarDonador,
    editarDonador,
    actualizarDonador
}