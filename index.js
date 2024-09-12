const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const app = express();

const user = 'jeetvani171@gmail.com';
const pass = 'pzfpugrazgzddezu';

app.use(cors({ origin: '*' }));
app.use(express.json());

// Function to send email
const sendEmail = async (mailOptions) => {
  const transporter =nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: user,
      pass: pass
    },
    port: 465
  })

  try {
    console.log('Sending email to:', mailOptions.to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Route to send mail to the driver
app.post('/mailToDriver', async (req, res) => {
  const { DriverName, DriverEmail, DriverPassword } = req.body;
  console.log('Received request to /mailToDriver with body:', req.body);

  const invalidFields = [];
  if (!DriverName) invalidFields.push('DriverName');
  if (!DriverEmail) invalidFields.push('DriverEmail');
  if (!DriverPassword) invalidFields.push('DriverPassword');

  if (invalidFields.length) {
    console.error('Invalid fields:', invalidFields);
    return res.status(400).send({ message: 'Invalid fields: ' + invalidFields.join(', ') });
  }

  if (DriverEmail.length < 6 || DriverEmail.indexOf('@') === -1 || DriverEmail.indexOf('.') === -1) {
    console.error('Invalid Email:', DriverEmail);
    return res.status(400).send({ message: 'Invalid Email' });
  }

  const template = `
    <h1>Hi ${DriverName}</h1>
    <p>Thank you for registering with us at Driver-Mode App</p>
    <p>Here are your login details:</p>
    <h3>Email: ${DriverEmail}</h3>
    <h3>Password: ${DriverPassword}</h3>
    <p>Thank you</p>
  `;

  const mailOptions = {
    from: 'jeet@jeet.com',
    to: DriverEmail,
    subject: 'Onboard Info On Driver-Mode App',
    html: template,
  };

  try {
    const info = await sendEmail(mailOptions);
    return res.status(200).send({ message: 'Mail sent successfully', info });
  } catch (err) {
    console.error('Failed to send mail to driver:', err);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

// Route to send generic email
app.post('/sendMail', async (req, res) => {
  const { TargetMail, Subject, Text } = req.body;
  console.log('Received request to /sendMail with body:', req.body);

  const requiredFields = [];
  if (!TargetMail) requiredFields.push('TargetMail');
  if (!Subject) requiredFields.push('Subject');
  if (!Text) requiredFields.push('Text');

  if (requiredFields.length) {
    console.error('Missing required fields:', requiredFields);
    return res.status(400).send({ message: 'Required Fields: ' + requiredFields.join(', ') });
  }

  const mailOptions = {
    from: user,
    to: TargetMail,
    subject: Subject,
    text: Text,
  };

  try {
    const info = await sendEmail(mailOptions);
    return res.status(200).send({ message: 'Mail sent successfully', info });
  } catch (err) {
    console.error('Failed to send mail:', err);
    return res.status(500).send({ message: 'Internal server error' });
  }
});


app.get('/', (req, res) => {
    res.send('Driver Mode SMTP API');
    }
);

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
