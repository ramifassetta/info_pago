require("dotenv").config();
const axios = require("axios");

// Cargar el token desde el archivo .env
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const webhook = async (req, res) => {
  console.log("Entro al controller");

  console.log(req.body);
  const { topic, resource } = req.body;
  console.log("data: ", resource);

  if (topic === 'payment' && resource) {
    const paymentId = resource;
    console.log("paymentId recibido en el webhook: ", paymentId);

    try {
      console.log("paymentid ",paymentId)
      const paymentInfo = await getPaymentDetails(paymentId);
      const email = paymentInfo.payer.email;
      console.log("email: ", email);

      res.sendStatus(200);
    } catch (error) {
      console.log('Error al obtener los datos del pago:', error);
      res.sendStatus(400);
    }
  } else {
    res.status(500);
  }
};

async function getPaymentDetails(paymentId) {

  try {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    if (response) {
      return response.data;
    }
  } catch (error) {
    throw new Error('Error al obtener los detalles del pago: ' + error.response.data.message);
  }
}

module.exports = { webhook };