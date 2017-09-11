const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'postgres'
});

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync();

var express = require('express');
var app = express();

app.get('/api', function (req, res) {
  res.send('Hello World (/api)!');
});

app.get('/api/getJane', function (req, res) {
  User.findOrCreate({where: {
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  }})
  .spread(jane => {
    res.send(JSON.stringify(jane.get({
      plain: true
    })));
  });
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
