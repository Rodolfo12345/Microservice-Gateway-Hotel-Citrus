const express = require('express');
const bodyParser = require('body-parser');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('../docs/swagger.json');

const app = express();
const port = process.env.PORT || 3000;

//app.use(bodyParser.json());
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Aquí se incluirían las rutas
// app.use('/users', require('./api/routes/users'));

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});

module.exports = app;
