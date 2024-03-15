// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const { User, getUserByUserName } = require('../models/userModel');

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).send('Email is required');
//     }

//     console.error(email);

//     const user = await getUserByUserName(email);

//     if (!user) {
//       console.error('Email not in database');
//       return res.status(403).send('Email not in database');
//     }

//     const token = crypto.randomBytes(20).toString('hex');
//     await user.update({
//       resetPasswordToken: token,
//       resetPasswordExpires: Date.now() + 3600000,
//     });

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_ADDRESS,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: 'mySqlDemoEmail@gmail.com',
//       to: user.email,
//       subject: 'Link To Reset Password',
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//         Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
//         http://localhost:3031/reset/${token}\n\n
//         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//     };

//     console.log('Sending mail');

//     transporter.sendMail(mailOptions, (err, response) => {
//       if (err) {
//         console.error('There was an error:', err);
//         return res.status(500).send('Error sending email');
//       } else {
//         console.log('Response:', response);
//         return res.status(200).json('Recovery email sent');
//       }
//     });
//   } catch (error) {
//     console.error('Error in forgotPassword:', error);
//     return res.status(500).send('Server error');
//   }
// };

// module.exports = { forgotPassword };