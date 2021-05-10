const { Op } = require('sequelize');
const { User, Request, Contact } = require('../models')

exports.createRequest = (req, res, next) => {
    User.findOne({
        where: {
            userid : req.body.receiver
        }
    })
    .then((resp) => {
        Contact.findOne({
            where:{
                User1Id: {
                    [Op.or]: [resp.id, req.user]
                },
                User2Id: {
                    [Op.or]: [resp.id, req.user]
                },
            }
        })
        .then((resp2) => {
            if(resp2) return res.status(200).json({
                error:'contact already exists'
            })
            Request.findOne({
                where:{
                    ReceiverId: {
                        [Op.or]: [resp.id, req.user]
                    },
                    SenderId: {
                        [Op.or]: [resp.id, req.user]
                    },
                }
            })
            .then((resp1) => {
                if(resp1) {
                    return res.status(200).json({
                        error:'request already exists'
                    })
                }
                else if(resp.id === req.user) {
                    return res.status(200).json({
                        error:'cannot send request to yourself'
                    })
                }
                else{
                    Request.create({
                        ReceiverId: resp.id,
                        SenderId: req.user,
                    })
                    .then((resp) => {
                        console.log(resp);
                        return res.status(200).json({
                            message: 'request sent'
                        })
                    })
                    .catch((e) => {
                        console.log(e);
                        return res.status(500).json({
                            error: 'error sending request'
                        });
                    })
                }
            })
            .catch((e) => {
                console.log(e);
                res.status(500).json({
                    error:'error'
                })
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json({
                error:'error'
            })
        });
        
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({
            error:'error'
        })
    });
}

exports.deleteRequest = (req, res, next) => {
    Request.destroy({
       where: { id: req.body.id }
    })
    .then(() => {
        return res.status(200).json({
            message: 'request deleted'
        })
    })
    .catch((e) => {
        return res.status(500).json({
            error: 'error sending request'
        })
    })
}

exports.rejectRequest = (req, res, next) => {
    Request.update({
        Status: 'Rejected'
    }, {
        where: { id: req.body.id }
     })
     .then(() => {
         return res.status(200).json({
             message: 'request deleted'
         })
     })
     .catch((e) => {
         return res.status(500).json({
             error: 'error sending request'
         })
     })
}

exports.receivedRequests = (req, res, next) => {
    Request.findAll({
        where: { ReceiverId: req.user, Status:'Pending' },
        include: {
            model: User,
            as: 'Sender',
        }
     })
     .then((resp) => {
         return res.status(200).json({resp})
     })
     .catch((e) => {
         return res.status(500).json({
             error: 'error getting requests'
         })
     })
}

exports.sentRequests = (req, res, next) => {
    Request.findAll({
        where: { SenderId: req.user },
        include: {
            model: User,
            as: 'Receiver',
        }
     })
     .then((resp) => {
         return res.status(200).json({resp})
     })
     .catch((e) => {
         return res.status(500).json({
             error: 'error getting requests'
         })
     })
}
