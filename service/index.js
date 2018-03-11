const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8001
});

server.register(require('./authSchema'), (err) => {
    server.auth.strategy('jwt', 'jwt');

    server.route({
        method: 'GET',
        path: '/private',
        config: {
            auth: 'jwt'
        },
        handler: function(request, reply) {
            //return credentials object which is token payload
            reply(request.auth.credentials);
        }
    });

    server.start((err) => {
        console.log('Server started at: ' + server.info.uri);
    });
});