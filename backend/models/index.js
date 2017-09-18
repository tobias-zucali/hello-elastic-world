// inspired by
// https://github.com/sequelize/sequelize/issues/6524

const Sequelize = require('sequelize');
const initModels = require('./tools/initModels');
const path = require('path');

const models = [
  require('./Comment.js'),
  require('./Post.js'),
  require('./User.js')
];



const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  dialect: 'postgres',
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT
});

const initedModels = initModels(models, sequelize);
// sequelize.sync({force: true});

module.exports = initedModels;
