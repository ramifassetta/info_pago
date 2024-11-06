const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const paymentRoutes = require('./routes/payments');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Configura morgan en modo 'dev'

// Rutas
app.use('/api/payments', paymentRoutes);

module.exports = app;
