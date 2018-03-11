const jwt = require('jsonwebtoken');
const fs = require('fs');

const Users = [
    {
        id: 1,
        username: 'borja',
        password: 12345,
        email: 'borja.tur@gmail.com'
    }
];

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'POST',
    path: '/signin',
    handler: function(request, reply) {
        const { username, password } = request.payload;
        const user = Users.find(e => e.username === username);
        if (user && user.password === parseInt(password)) {
            const privKey = fs.readFileSync(`${__dirname}/private.key`);  // get private key
            const tokenPayload = {
                id: user.id
            };
            //sign token
            const token = jwt.sign(tokenPayload, privKey, { expiresIn: 1800, algorithm: 'RS256' });
            return reply({ token });
        }
        return reply('Unauthorized').code(401);
    }
});

server.start((err) => {
    console.log('Server started at: ' + server.info.uri);
});