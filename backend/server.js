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

sequelize.sync()
  .then(
    () => User.findOrCreate({where: {
      username: 'janedoe',
      birthday: new Date(1980, 6, 20)
    }})
    .spread(jane => {
      console.log(jane.get({
        plain: true
      }));
    })
  );

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World (/)!')
})

app.get('/api', function (req, res) {
  res.send('Hello World (/api)!')
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})
