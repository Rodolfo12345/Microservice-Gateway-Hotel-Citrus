const axios = require('axios');
const jwt = require('jsonwebtoken');
const findMatchingApi = require('../utils/findMatchingApi');
const config = require('../config/config');

const apiGatewayMiddleware = async (req, res, next) => {
  const { url, method, body } = req;
  const api = findMatchingApi(url, method);

  if (api) {
    const { baseUrl, path } = api;
    const apiUrl = `${baseUrl}${path}`;

    try {
      const route = Object.values(config.apis[api.serviceName].routes).find(route => route.path === path && route.method === method);
      if (route && route.requiresPermission !== null) {
        const token = req.headers.authorization;
        
        if (!token) {
          return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
        }

        const tokenParts = token.split(' ');

        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Formato de token inválido' });
        }

        const tokenValue = tokenParts[1];

        try {
          const response = await axios.post(
              `${config.apis.auth.url}/auth/validate-token`,
              { token: tokenValue }
          );
        
          if (!response.data.valid) {
            return res.status(401).json({ message: 'Token de autenticación no válido' });
          }
          
          const decodedToken = jwt.decode(token.split(" ")[1]);
          if (!decodedToken || !decodedToken.permissions) {
            return res.status(401).json({ message: 'Token de autenticación no válido' });
          }
        
          const permissions = decodedToken.permissions;
          console.log("permissions: ", permissions)
          if (!permissions.some(permission => route.requiresPermission.includes(permission))) {
              console.log('No tienes los permisos necesarios para acceder a esta ruta');
              return res.status(403).json({ message: 'No tienes los permisos necesarios para acceder a esta ruta' });
          }

          // Realizar la solicitud al microservicio correspondiente
          try {
            const response = await axios({ url: apiUrl, method, data: body });
            res.status(response.status).json(response.data);
        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
        

        } catch (error) {
          console.error('Error al validar el token:', error);
          return res.status(500).json({ message: 'Error Token corrupto' });
        }
        
      } else {
        // Realizar la solicitud al microservicio correspondiente
        try {
            const response = await axios({ url: apiUrl, method, data: body });
            res.status(response.status).json(response.data);
        } catch (error) {
            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else {
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
      }
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  } else {
    next();
  }
};

module.exports = apiGatewayMiddleware;
