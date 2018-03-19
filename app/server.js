const express = require('express');

const app = express();
const data = require('./data');

const port = require('./config');

require('./config/express').init(app);
// require('./routs').init(app, data);

app.listen(port, ()=> console.log('Ready on 3001'));
