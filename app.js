const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dataSampleRoutes = require('./routes/data-sample');
const ruleRoutes = require('./routes/rule');

const db = require('./data/db');
const app = express();

app.use(bodyParser.json());

db.connect(err => {
  if (err) {
    console.log('unable to connect to database');
    return;
  }
  app.listen(3000, () => {
    console.log('connect to database, app listening on port 3000');
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH , PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/data-sample', dataSampleRoutes);
app.use('/rule', ruleRoutes);
