const ExtendedModel = require('./tools/ExtendedModel.js');

module.exports = class User extends ExtendedModel {
  static init(sequelize) {
    return super.init({
      firstName: {
        type: this.DataTypes.STRING,
        // allowNull: false,
      },
      lastName: {
        type: this.DataTypes.STRING,
        // allowNull: false,
      },
      username: {
        type: this.DataTypes.STRING,
        allowNull: false,
        permission: this.Permissions.ALL
      },
      password: {
        type: this.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: this.DataTypes.STRING,
        // allowNull: false,
        validate: {
          isEmail: true
        }
      },
      isActive: {
        type: this.DataTypes.BOOLEAN
      }
    }, { sequelize })
  };

  static associate(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    this.hasMany(models.Post, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });

    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    this.hasMany(models.Comment, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  }
};
