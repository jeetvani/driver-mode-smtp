const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')
const app = express()

const user = 'jeetvani171@gmail.com'
const pass = 'pzfpugrazgzddezu'

app.use(cors({ origin: '*' }))
app.use(express.json())
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: user,
    pass: pass
  },
  port: 465
})
// Function to send email
const sendEmail = async mailOptions => {
  try {
    console.log('Sending email to:', mailOptions.to)
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.response)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// HTML Template with Bootstrap styling in both English and Portuguese
const emailTemplate = (DriverName, DriverEmail, DriverPassword) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Onboarding Information</title>
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body style="background-color: #f8f9fa;">
      <div class="container mt-5">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h2>Welcome to Driver-Mode App</h2>
          </div>
          <div class="card-body">
            <h4>Hi ${DriverName},</h4>
            <p>Thank you for registering with us at Driver-Mode App.</p>
            <p>Here are your login details:</p>
            <p><strong>Email:</strong> ${DriverEmail}</p>
            <p><strong>Password:</strong> ${DriverPassword}</p>
            <p>Thank you for joining!</p>
          </div>
          <div class="card-footer text-muted text-center">
            <small>Driver-Mode App &copy; 2024</small>
          </div>
        </div>
      </div>

      <!-- Portuguese Version -->
      <div class="container mt-5">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h2>Bem-vindo ao Aplicativo Driver-Mode</h2>
          </div>
          <div class="card-body">
            <h4>Olá ${DriverName},</h4>
            <p>Obrigado por se registrar conosco no aplicativo Driver-Mode.</p>
            <p>Aqui estão seus detalhes de login:</p>
            <p><strong>Email:</strong> ${DriverEmail}</p>
            <p><strong>Senha:</strong> ${DriverPassword}</p>
            <p>Obrigado por se juntar a nós!</p>
          </div>
          <div class="card-footer text-muted text-center">
            <small>Driver-Mode App &copy; 2024</small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Route to send mail to the driver
app.post('/mailToDriver', async (req, res) => {
  const { DriverName, DriverEmail, DriverPassword } = req.body
  console.log('Received request to /mailToDriver with body:', req.body)

  const invalidFields = []
  if (!DriverName) invalidFields.push('DriverName')
  if (!DriverEmail) invalidFields.push('DriverEmail')
  if (!DriverPassword) invalidFields.push('DriverPassword')

  if (invalidFields.length) {
    console.error('Invalid fields:', invalidFields)
    return res
      .status(400)
      .send({ message: 'Invalid fields: ' + invalidFields.join(', ') })
  }

  if (
    DriverEmail.length < 6 ||
    DriverEmail.indexOf('@') === -1 ||
    DriverEmail.indexOf('.') === -1
  ) {
    console.error('Invalid Email:', DriverEmail)
    return res.status(400).send({ message: 'Invalid Email' })
  }

  const mailOptions = {
    from: 'jeet@jeet.com',
    to: DriverEmail,
    subject: 'Onboarding Information for Driver-Mode App',
    html: emailTemplate(DriverName, DriverEmail, DriverPassword)
  }

  try {
    const info = await sendEmail(mailOptions)
    return res.status(200).send({ message: 'Mail sent successfully', info })
  } catch (err) {
    console.error('Failed to send mail to driver:', err)
    return res.status(500).send({ message: 'Internal server error' })
  }
})

app.get('/', (req, res) => {
  res.send('Driver Mode SMTP API')
})

app.post('/sendEmail', async (req, res) => {
  const { to, subject, text } = req.body
  console.log('Received request to /sendEmail with body:', req.body)
  try {
    const info = await sendEmail({
      from: user,
      to: to,
      subject: subject,
      text: text
    })
    await transporter.sendMail({
      to: to,
      subject: subject,
      text: text,
      info 
    })
    res.status(200).send({
      message: 'Email sent successfully'
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    return res.status(500).send({ message: 'Internal server error' })
  }
})

app.listen(5000, () => {
  console.log('Server started on port 4000')
})
