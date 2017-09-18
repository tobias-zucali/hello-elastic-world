const ExtendedModel = require('./tools/ExtendedModel.js');

module.exports = class Comment extends ExtendedModel {
  static init(sequelize) {
    return super.init({
      title: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      }
    }, { sequelize })
  };

  static associate(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.Comment);
    this.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.Comment);
    this.belongsTo(models.Post, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  }
};
