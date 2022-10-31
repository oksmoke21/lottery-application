const express = require('express');
const bodyParser = require('body-parser');
const contractInfoRoutes = require('./routes/contractInfo');

const app = express();

app.use((req, res, next) => { // set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(contractInfoRoutes);

app.listen(5000);