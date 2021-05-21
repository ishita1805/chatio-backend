const Sequelize = require('sequelize');
const db = require('../db/sequelize');

const Contact = db.define('Contacts', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  conversation: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:false,
  },
  notification: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue:false,
  }
});

module.exports = Contact;
