import nodemailer from 'nodemailer'


const sendEmail = async({from = process.env.EMAIL , to ,subject ,text , html ,cc , bcc , attatchment }={})=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
         auth: {
           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
           user: process.env.EMAIL,
           pass: process.env.PASSWORD_GMAIL,
         },
         tls: {
           rejectUnauthorized: false
         }
       });
       
       // async..await is not allowed in global scope, must use a wrapper
         // send mail with defined transport object
         const info = await transporter.sendMail({
           from: `"Fred Foo 👻" <${from}>`, // sender address
           to, // list of receivers
           subject, // Subject line
           text, // plain text body
           html, // html body
         });
       
         console.log("Message sent: %s", info);
      
       }
export default sendEmail

