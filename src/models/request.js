const Sequelize = require('sequelize');
const db = require('../db/sequelize');

const Request = db.define('Requests', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  Status: {
    type: Sequelize.UUID,
    allowNull: true,
    defaultValue: 'Pending',
  },
});

module.exports = Request;
