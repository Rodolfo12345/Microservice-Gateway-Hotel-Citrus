// findMatchingApi.js
const config = require('../config/config');

function findMatchingApi(url, method) {
    for (const [serviceName, serviceConfig] of Object.entries(config.apis)) {
        const { url: baseUrl, routes } = serviceConfig;
        for (const [routeName, routeConfig] of Object.entries(routes)) {
            const { path, method: routeMethod } = routeConfig;
            if (path === url && routeMethod === method) {
                return { serviceName, baseUrl, path }; // Se devuelve la URL base en lugar del puerto
            }
        }
    }
    return null;
}

module.exports = findMatchingApi;
