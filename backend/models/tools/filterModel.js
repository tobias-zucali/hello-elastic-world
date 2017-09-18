const Sequelize = require('sequelize');

module.exports = Base => class extends Base {
  filterModel() {
    console.log('yay!')
    return this.toJSON();
  }
};
