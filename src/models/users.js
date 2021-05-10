const Sequelize = require('sequelize');
const db = require('../db/sequelize');

const User = db.define('Users', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  userid: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastseen: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
