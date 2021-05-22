const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = (req, res, next) => {
    User.findOne({
        where: { userid: req.body.userid }
    })
    .then((resp) => {
        if(!resp) return res.status(500).json({
            error: 'no user by this id'
        })
        bcrypt.compare(req.body.password, resp.password)
        .then((resp2) => {
            if(!resp2) return res.status(500).json({
                error: 'password did not match'
            })
            User.update({
                online: true
            }, {
                where: { userid: req.body.userid }
            })
            .then(() => {
                const token = jwt.sign(resp.id, process.env.ACCESS_TOKEN_SECRET);
                res.cookie('chat-jwt', token, { domain: process.env.DOMAIN });
                res.cookie('chat-userid', resp.userid.toString(), { domain: process.env.DOMAIN });
                res.cookie('chat-id', resp.id.toString(), { domain: process.env.DOMAIN });
                return res.send({
                    data: 'User has logged In'
                })
            })
            .catch(() => {
                return res.status(500).json({
                    error: 'error updating status',
                })
            })
            
        })
        .catch(() => {
            return res.status(500).json({
                error: 'error verifying password',
            })
        }); 
    })
    .catch((e) => {
        return res.status(500).json({
            error: 'error connecting to server',
        })
    })
}

exports.signup = (req, res, next) => {
    User.findOne({
        where: { userid: req.body.userid }
    })
    .then((resp) => {
        if(resp) return res.status(500).json({
            error: 'user already exists'
        })
        bcrypt.hash(req.body.password, 8)
        .then((hash) => {
            const user = {
                userid: req.body.userid,
                password: hash,
                lastseen: new Date().toString()
            }
            User.create(user)
            .then((resp2) => {
                const token = jwt.sign(resp2.id, process.env.ACCESS_TOKEN_SECRET);
                res.cookie('chat-jwt', token, { domain: process.env.DOMAIN });
                res.cookie('chat-userid', resp2.userid.toString(), { domain: process.env.DOMAIN });
                res.cookie('chat-id', resp2.id.toString(), { domain: process.env.DOMAIN });
                return res.send({
                    data: 'User has signed up'
                })
            })
            .catch((e) => {
                console.log(e);
                return res.status(500).json({
                    error: 'error creating account',
                    message: e,
                })
            });
           
        })
        .catch((e) => {
            return res.status(500).json({
                error: 'error verifying password',
            })
        }); 
    })
    .catch((e) => {
        console.log(e);
        return res.status(500).json({
            error: 'error connecting to server',
            message: e,
        })
    })
}

exports.logout = (req, res, next) => {
    User.update({
        lastseen: new Date().toString(),
        online: false,

    }, { where: { id: req.body.ID }})
    .then(() => {
        res.clearCookie('chat-id',{ domain: process.env.DOMAIN });
        res.clearCookie('chat-userid',{ domain: process.env.DOMAIN });
        res.clearCookie('chat-jwt',{ domain: process.env.DOMAIN });
        return res.status(200).json({
            message: 'user logged out'
        })
    })
    .catch((e) => {
        console.log(e);
        return res.status(500).json({
            error: 'error logging out'
        })
    })
   
}