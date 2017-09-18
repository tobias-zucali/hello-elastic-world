module.exports = function initModels(modelClasses, sequelize) {
  // Load each model file
  const models = Object.assign(
    {},
    ...modelClasses.map((model) => ({
      [model.name]: model.init(sequelize)
    }))
  );

  // Load model associations
  Object.keys(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  return models;
}
