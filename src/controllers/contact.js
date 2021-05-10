const { Op } = require('sequelize');
const { Contact, Request, User } = require('../models')

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
        ]
    })
    .then((resp) => {
     res.status(200).json({
         resp
     }) 
    })
    .catch((e) => {
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