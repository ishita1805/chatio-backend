require('dotenv').config();
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_NAME_PROD, process.env.DB_OWNER_ID_PROD, process.env.DB_PASS_PROD, {
  host: process.env.DB_HOST_PROD,
  dialect: process.env.DB_DIALECT,
  operatorAliases: false,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    aquire: 30000,
    idle: 10000,
  },
});

// test DB
db.authenticate()
  .then(() => {
    console.log('DB connected!');
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

// add within sync to drop and re create tables -> { force: true }
db.sync(
  // { force: true }
)
  .then(() => {
    console.log('all tables created');
  })
  .catch((err) => {
    console.log('error: ', err);
  });

module.exports = db;
