const { Contact, Message } = require('../models');
const cloudinary = require('cloudinary');
const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, '../../tmp');

cloudinary.config({
    cloud_name:'dk61kyoxd',
    api_key:'589872813843811',
    api_secret:'lADV6Em1XNa3869h6EGa_o4UZHI',
});


exports.create = (req, res, next) => {
    Message.create(req.body)
    .then((resp) => {
        Contact.update({
            id: req.body.ContactId,
            notification: true
        },{
            where: { id: req.body.ContactId }
        })
        .then(() => {
            res.status(200).json({ resp })
        })
        .catch((e) => {
            res.status(500).json({ e })
        });
    })
    .catch((e) => {
        res.status(500).json({ e })
    });
}

exports.createMedia = (req, res, next) => {
    let file = req.files.file; 
    let data = req.body;
    cloudinary.uploader.upload(file.tempFilePath)
    .then((result) => {
       data.file = result.url;
       data.pid = result.public_id;
       Message.create(data)
        .then((resp) => {
            Contact.update({
                id: req.body.ContactId,
                notification: true
            },{
                where: { id: req.body.ContactId }
            })
            .then(() => {
                fs.rmdir(pathToDir,{ recursive: true }, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted tmp folder');
                });
                res.status(200).json({ resp })
            })
            .catch((e) => {
                console.log(e);
                res.status(500).json({ e })
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(500).json({ e })
        });
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({ e })
    });
}

exports.deleteMedia = (req, res, next) => {
    console.log(req.body.id);
    console.log(req.body.pid);
    cloudinary.uploader.destroy(req.body.pid)
    .then((response) => {
        console.log(response);
        Message.destroy({ where: { id: req.body.id } })
        .then(() => {
            res.status(200).send({
                message: 'media file deleted successfully!'
            })
        })
        .catch((e) => {
            res.status(500).json({ e })
        })
    })
    .catch((e) => {
        res.status(500).json({ e })
    })
}