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
      email: projectOwnerEmail, 
      subject: "New Contact Message",
      message: `You have a new message from ${name} (${email}):\n\n${message}`
    };

    await sendEmail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact message", error);
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
};

module.exports = {
  sendMessage,
};