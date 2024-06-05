// controllers/emailController.js
/* const nodemailer = require('nodemailer');
const User = require('../models/Donadores'); */
import nodemailer from 'nodemailer';
import Donadores from '../models/Donadores.js';

const sendEmails = async (req, res) => {
  const { subject, message, alias } = req.body;

  try {
    const users = await Donadores.findAll();

    if (!users.length) {
        return res.status(404).render('admin/emailForm', {
            pagina: 'Enviar Correos Masivos',
            csrfToken: req.csrfToken(),
            datos: req.body,
            errores: [{ msg: 'No users found in the database' }]
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
        errores: [{ msg: 'Emails sent successfully' }]
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).render('admin/emailForm', {
        pagina: 'Enviar Correos Masivos',
        csrfToken: req.csrfToken(),
        datos: req.body,
        errores: [{ msg: 'Internal server error' }]
      });
    }
};

const crearCorreo = async(req,res) =>{
   res.render('admin/emailForm',{
        pagina: 'Enviar Correos Masivos',
        csrfToken: req.csrfToken(), // usandp CSRF Proteccion
        datos:{},  // Otros datos que quieras pasar
        errores: [] //pasa una lista de errores incialemnte
   });
};

export{
    crearCorreo,
    sendEmails
}