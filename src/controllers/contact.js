const { Op } = require('sequelize');
const { Contact, Request, User, Message } = require('../models')

exports.createContact = (req, res, next) => {
    Contact.create({
        User1Id: req.user,
        User2Id: req.body.user
    })
    .then((resp) => {
        Request.destroy({
            where: {
                id: req.body.id
            }
        })
        .then(() => {
           Contact.findOne({
               where: {
                   id: resp.id
               },
                include:[
                    {
                        model: User,
                        as: 'User1'
                    },
                    {
                        model: User,
                        as: 'User2'
                    }
                ]
           })
           .then((contact) => {
            res.status(200).json({
                resp: contact
            }) 
           })
           .catch((e) => {
            res.status(500).json({
                error: 'could not get contaCt'
            })
        });
        })
        .catch((e) => {
            res.status(500).json({
                error: 'could not delete request'
            })
        })
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error: 'could not create contact'
        })
    })
}

exports.getContacts = (req, res, next) => {
    Contact.findAll({
        where: {
            [Op.or]: {
                User1Id: req.user,
                User2Id: req.user,
            }
        },
        include:[
            {
                model: User,
                as: 'User1'
            },
            {
                model: User,
                as: 'User2'
            },
            {
                model: Message,
                limit: 1,
                order: [[ 'createdAt', 'DESC' ]]
            },
        ],
        order: [[ 'updatedAt', 'DESC' ]]
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error: 'could not get contaCt'
        })
    });
}

exports.getConversations = (req, res, next) => {
    Contact.findAll({
        where: {
            [Op.or]: {
                User1Id: req.user,
                User2Id: req.user,
            },
            conversation: true,
        },
        include:[
            {
                model: User,
                as: 'User1'
            },
            {
                model: User,
                as: 'User2'
            },
            {
                model: Message,
                limit: 1,
                order: [[ 'createdAt', 'DESC' ]]
            },
        ],
        order: [[ 'updatedAt', 'DESC' ]]
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error: 'could not get contaCt'
        })
    });
}


exports.updateContact = (req, res, next) => {
    Contact.update({ conversation: true },{
        where: {
           id: req.body.id
        }
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        res.status(500).json({
            error: 'could not update conversation'
        })
    });
}

exports.updateNotification = (req, res, next) => {
    Contact.update({ notification: false },{
        where: {
           id: req.body.id
        }
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        res.status(500).json({
            error: 'could not update conversation'
        })
    });
}

exports.getContact = (req, res, next) => {
    Contact.findOne({
        where: {
           id: req.body.id
        },
        include: [
            {
                model: User,
                as: 'User1'
            },
            {
                model: User,
                as: 'User2'
            },
            {
                model: Message,
                include: {
                    model: User
                },
            },
        ],
        order: [
            [Message, 'createdAt', 'DESC'],
        ],
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error: 'error getting conversation'
        })
    });
}

exports.getContactMedia = (req, res, next) => {
    Message.findAll({
        where: {
            ContactId: req.body.id,
            type: 'media',
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    })
    .then((resp) => {
        // console.log(resp);
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error: 'error getting conversation'
        })
    });
}


