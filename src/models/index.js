const User = require('./users');
const Request = require('./request')
const Contact = require('./contact')

const dbs = {
    User,
    Request,
    Contact,
}    
// requests
User.hasMany(Request, { as: 'RequestsReceived', foreignKey:'ReceiverId' });
User.hasMany(Request, { as: 'RequestsSent', foreignKey:'SenderId' });
Request.belongsTo(User, { as: 'Sender', foreignKey:'SenderId' });
Request.belongsTo(User, { as: 'Receiver', foreignKey:'ReceiverId' });
// contacts
User.hasMany(Contact, { as: 'ContactsUser1', foreignKey:'User1Id' });
User.hasMany(Contact, { as: 'ContactsUser2', foreignKey:'User2Id' });
Contact.belongsTo(User, { as: 'User1', foreignKey:'User1Id' });
Contact.belongsTo(User, { as: 'User2', foreignKey:'User2Id' });

module.exports = dbs;
