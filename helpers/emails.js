import nodemailer from 'nodemailer'

const emailRegistro = async(datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true para usar SSL/TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    //   console.log(datos)
    const{email, nombre, token } = datos
    //enviar el email
    await transport.sendMail({
        from: 'ju1an34xd@gmail.com',
        to:email,
        subject:'Confirma tu cuenta en FSFLMXsinfronteras.com',
        text:'Confirma tu cuenta en  FSFLMXsinfronteras.com',
        html:`
        <p>hola el usuario ${nombre},quiere que compruebes su cuenta en FSFLMXsinfronteras.com</p>
        <p>La cuenta ya esta lista,solo debes de confirmarla en el siguiente enlace </p>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>

        <p>si no reconoce los datos ignorelos  </p>

        `
    })

}

const emailOlvidePassword = async(datos)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  //   console.log(datos)
  const{email, nombre, token } = datos
  //enviar el email
  await transport.sendMail({
      from: 'ju1an34xd@gmail.com',
      to:email,
      subject:'Restablece tu contraseña en FSFLMXsinfronteras.com',
      text:'Restablece tu contraseña en  FSFLMXsinfronteras.com',
      html:`
      <p>hola ${nombre},Has solicitado restablcer tu password</p>
      <p>Sigue el siguiente enlcae para generar un password nuevo </p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer contraseña</a>

      <p>si tu no solicitaste el cambio de password ,puedes ignorar este mensaje </p>

      `
  })

}


export{
    emailRegistro,
    emailOlvidePassword
}