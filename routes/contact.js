const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'campusmart.queries@gmail.com',
        pass: 'iivj bevo xodq fnbw' // app password
      }
    });

    const mailOptions = {
      from: 'campusmart.queries@gmail.com', // Gmail requires this
      to: 'campusmart.queries@gmail.com',
      replyTo: email, // so reply goes to user
      subject: `New message from ${name}`, // ✅ fixed
      text: `
You have received a new message from CampusMart Contact Form:

Name: ${name}
Email: ${email}
Message:
${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
