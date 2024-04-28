module.exports = {
    apis: {
        // Microservices Auth
        auth: {
            url: 'http://localhost:3001',
            requireAuth: false,
            routes: {
                login: {
                    method: 'POST',
                    path: '/auth/login',
                    requiresPermission: null,
                },
                validateToken: {
                    method: 'POST',
                    path: '/auth/validate-token',
                    requiresPermission: null,
                },
            },
        },
        // Microservices Users
        user: {
            url: 'http://localhost:3002',
            requireAuth: true,
            routes: {
                getAllUsers: {
                    method: 'GET',
                    path: '/users',
                    requiresPermission: ['GET_USERS'],
                },
                createUser: {
                    method: 'POST',
                    path: '/users',
                    requiresPermission: ['CREATE_USER'],
                },
                editUser: {
                    method: 'PUT',
                    path: '/users/:id',
                    requiresPermission: ['EDIT_USER'],
                },
                deleteUser: {
                    method: 'DELETE',
                    path: '/users/:id',
                    requiresPermission: ['DELETE_USER'],
                },
            },
        },
    },
};
