const Sequelize = require('sequelize');

module.exports =
  class User extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        firstName: {
          type: Sequelize.STRING,
          // allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          // allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          // allowNull: false,
          validate: {
            isEmail: true
          }
        },
        isActive: {
          type: Sequelize.BOOLEAN
        }
      }, { sequelize })
    };

    static associate(models) {
      // Using additional options like CASCADE etc for demonstration
      // Can also simply do Task.belongsTo(models.User);
      this.hasMany(models.Post, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });

      // Using additional options like CASCADE etc for demonstration
      // Can also simply do Task.belongsTo(models.User);
      this.hasMany(models.Comment, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });
    }

    toFrontend() {
      // TODO: filter
      // console.log(this.constructor.attributes);
      return this.toJSON();
    }
  }
