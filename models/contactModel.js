const mongoose = require('mongoose');
const validator = require("validator");
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, validate: [validator.isEmail, 'Invalid email'] },
    message: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
