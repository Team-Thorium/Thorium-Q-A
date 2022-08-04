require('dotenv').config();
const express = require('express');
const router = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/qa', router);

app.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT);
});

module.exports = app;
