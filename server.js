const express = require('express')
const bodyParser = require('body-parser')
const sqlite = require('sqlite3').verbose();
const PORT = process.env.PORT || 3000 ;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
