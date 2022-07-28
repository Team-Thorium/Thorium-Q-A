const express = require('express');
const db = require('./db');

const app = express();

app.listen(process.env.PORT || 3000);
