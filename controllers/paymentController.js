// controllers/paymentController.js
const mercadopago = require('mercadopago');

// Configura Mercado Pago con el token de acceso
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// Controlador para crear un link de pago
const createPayment = async (req, res) => {
  const { title, unit_price, quantity } = req.body;

  const preference = {
    items: [
      {
        title,
        quantity,
        currency_id: 'ARS', // Cambia a tu moneda si es necesario
        unit_price
      }
    ],
    notification_url: 'https://tu-dominio.com/api/payments/webhook',  // Cambia a tu URL real
    back_urls: {
      success: 'https://tu-dominio.com/success',
      failure: 'https://tu-dominio.com/failure',
      pending: 'https://tu-dominio.com/pending'
    },
    auto_return: 'approved'
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id, init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el link de pago' });
  }
};

// Controlador para manejar el webhook de Mercado Pago
const webhook = async (req, res) => {
  const { query } = req;

  if (query.type === 'payment' && query['data.id']) {
    const paymentId = query['data.id'];

    try {
      const payment = await mercadopago.payment.findById(paymentId);

      // Procesa los datos del pago según tu lógica (guárdalos en tu base de datos)
      console.log('Datos del pago:', payment);

      res.sendStatus(200); // Responde 200 a Mercado Pago para indicar éxito
    } catch (error) {
      console.error('Error al obtener los datos del pago:', error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
};

module.exports = { createPayment, webhook };
