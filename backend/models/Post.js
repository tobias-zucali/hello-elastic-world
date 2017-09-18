const ExtendedModel = require('./tools/ExtendedModel.js');

module.exports = class Post extends ExtendedModel {
  static init(sequelize) {
    return super.init({
      title: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: this.DataTypes.TEXT,
        allowNull: false,
      },
      assets: {
        type: this.DataTypes.JSON,
        allowNull: true
      },
    }, { sequelize })
  };

  static associate(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.Post);
    this.hasMany(models.Comment, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });

    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.Post);
    this.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  }
};
