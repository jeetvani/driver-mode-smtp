var nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*'

}));
app.use(express.json());
app.post('/mailToDriver', async (req, res) => {
    const { DriverName, DriverEmail, DriverPassword } = req.body;
    const invalidFields = [];

    if (!DriverName) {
        invalidFields.push('DriverName');
    }
    if (!DriverEmail) {
        invalidFields.push('DriverEmail');
    }
    if (!DriverPassword) {
        invalidFields.push('DriverPassword');
    }
    if (invalidFields.length) {
        return res.status(400).send({
            message: 'Invalid fields' + invalidFields.join(', ')

        });
    }
    if (DriverEmail.length < 6 || DriverEmail.indexOf('@') === -1 || DriverEmail.indexOf('.') === -1) {
        return res.status(400).send({
            message: 'Invalid Email'
        });
    }
    const template = `
    <h1>Hi ${DriverName}</h1>
    <p>Thank you for registering with us at Driver-Mode App</p>
    <p>Here are your login details:</p>
    <h3>
    Email: ${DriverEmail}

    </h3>
    <h3>
    Password: ${DriverPassword}
    </h3>
    <p>Thank you</p>
    `

    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rftr.tech@gmail.com',
                pass: 'xcmlxonbwgupaaum'
            }
        });

        const mailOptions = {
            from: 'jeet@jeet.com', // sender address
            to: DriverEmail, // list of receivers
            subject: 'Onboard Info On Driver-Mode App', // Subject line
            html: template
        };

        const sendMail = await transporter.sendMail(mailOptions);
        return res.status(200).send({
            message: 'Mail sent successfully',
            sendMail
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Internal server error'
        })
    }


})

app.listen(4000, () => {
    console.log('Server started on port 4000');
}
)

