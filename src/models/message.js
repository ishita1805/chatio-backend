const Sequelize = require('sequelize');
const db = require('../db/sequelize');

const Message = db.define('Messages', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  body: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue:'text',
  },
  file: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pid: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

module.exports = Message;
