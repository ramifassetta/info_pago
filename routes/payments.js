// routes/payments.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Ruta para crear un link de pago
router.post('/create_payment', paymentController.createPayment);

// Ruta para manejar el webhook de Mercado Pago
router.post('/webhook', paymentController.webhook);

module.exports = router;
