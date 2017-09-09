const express = require('express');

const { Client, Pool } = require('pg');

const pool = new Pool()

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
});

console.log('hi there!')

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World (/)!');
});

app.get('/api', function (req, res) {
  res.send('Hello World (/api)!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
