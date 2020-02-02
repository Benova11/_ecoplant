const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const db = require('./db');
const ds_collection = 'data-sample';
const fr_collection = 'formula';

app.use(bodyParser.json());
