const express = require('express');
const debug = require('debug')('http');
const http = require('http');

const app = express();
const data = require('./data');

const port = require('./config');

require('./config/express').init(app);
require('./config/authentication').init(app, data);
require('./routes').init(app, data);

// app.listen(port, () => {
//     console.log('Ready on 3001');
//     const addr = server.address();
//     const bind = typeof addr === 'string' ?
//         'Pipe ' + addr :
//         'Port ' + addr.port;
//     debug('Listening on ' + bind);
// });

const server = http.createServer(app);

server.listen(port, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
        'Pipe ' + addr :
        'Port ' + addr.port;
    debug('Listening on ' + bind);
});
