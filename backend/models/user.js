module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user",{
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });
};
