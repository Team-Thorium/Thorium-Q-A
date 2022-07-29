const express = require('express');
const client = require('./db');

const app = express();

app.get('qa/:id');
app.post('/qa/:id');
app.post('/qa/:id/answers');
app.put('/qa/question/:id/helpful');
app.put('/qa/answer/:id/helpful');
app.put('/qa/question/:id/report');
app.put('/qa/answer/:id/report');
app.listen(process.env.PORT || 3000);
