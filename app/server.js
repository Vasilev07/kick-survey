const express = require('express');

const app = express();
const data = require('./data');

require('./config/express').init(app);
// require('./routs').init(app, data);

app.listen(3001, ()=> console.log('Ready on 3001'));
