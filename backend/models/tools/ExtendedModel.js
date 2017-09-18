const Sequelize = require('sequelize');

const Permissions = {
  OWNER: 1,
  GROUP: 2,
  ALL: 3
};

module.exports = class ExtendedModel extends Sequelize.Model {

  static get DataTypes() {
    return Sequelize.DataTypes;
  };

  static get Permissions() {
    return Permissions;
  };

  get Permissions() {
    return Permissions;
  };

  toFrontend(permission = Permissions.ALL) {
    const data = this.toJSON();
    return Object.keys(data).reduce((reducedData, key) => {
      if (this.rawAttributes[key].permission >= permission) {
        return {
          ...reducedData,
          [key]: data[key]
        }
      } else {
        return reducedData;
      }
    }, {});
  };
}
