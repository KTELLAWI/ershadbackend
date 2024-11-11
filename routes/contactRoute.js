const express = require('express');
const { auth } = require('../middlewares/auth');
const { sendMessage } = require('../controllers/contactController');
const router = express.Router();


router.post('/', sendMessage);

module.exports = router;
