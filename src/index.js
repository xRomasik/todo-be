const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./routes');

routes(app);

app.listen(port);

console.log(`todo list RESTful API server started on: ${port}`);
