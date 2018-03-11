const jwt = require('jsonwebtoken');
const fs = require('fs');

extractToken = (request) => {
    const authorization = request.headers.authorization;
    let token;
    if (authorization) {
        token = request.headers.authorization.replace('Bearer ', '');
    }
    return token;
};

const scheme = function (server, options) {
    return {
        authenticate: function (request, reply) {
            const token = extractToken(request);
            if (!token) {
                return reply('unauthorized').code(401);
            }

            request.auth.token = token;
            const pubKey = fs.readFileSync(`${__dirname}/public.key`);  // get public key
            let decoded;
            try {
                decoded = jwt.verify(token, pubKey);                
            } catch (e) {
                return reply('unauthorized').code(401);
            }
            return reply.continue({
                credentials: decoded,
                artifacts: token
            });
        }
    }
};

const register = function (server, options, next) {
    server.auth.scheme('jwt', scheme);
    return next();
};

register.attributes = {
    name: 'jwt',
    version: '1.0.0'
};

exports.register = register;