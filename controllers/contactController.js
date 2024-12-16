const Contact = require("../models/contactModel");
const sendEmail = require("../utils/email");

const projectOwnerEmail = process.env.EMAIL;

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    const mailOptions = {
      name: name,
      email: email,
      subject: " طلب اتصال عن  طريق الموقع",
      message: `\n\n${message}`
    };

    await sendEmail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
};

module.exports = {
  sendMessage,
};