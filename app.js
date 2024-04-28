const express = require('express');
const apiGatewayMiddleware = require('./srs/middleware/apiGatewayMiddleware');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());

// Middleware para manejar las solicitudes
app.use(apiGatewayMiddleware);

// Registrar la ruta de autenticación
app.post('/auth/login', (req, res) => {
  res.status(200).json({ message: 'Ruta de inicio de sesión' });
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});

module.exports = app;
