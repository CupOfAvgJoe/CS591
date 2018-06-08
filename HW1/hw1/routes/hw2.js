const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cs591');
const db = mongoose.connection;
db.once('open', function() {
    console.log(`Connection Successful`)
});

const Schema = mongoose.Schema;
const stringSchema = new Schema({
    string: String,
    length: Number
});
const stringModel = mongoose.model('stringModel', stringSchema);

// Part 3.2 in HW2
// GET all strings in database

router.get('/', function (req, res, next) {
    stringModel.find({}, '-_id -__v -length', function(err, reply) {
       res.send(reply)
    });
});

// Part 3.1 in HW2
// GET string and length from database if it exists;
//      else, create entry and return string and length

router.get('/:string', function (req, res, next) {

    const string = req.params.string;

    stringModel.find({string: string}, `-_id -__v`, function(err, reply) {
        if (reply.length == 0) {
            console.log(`Entry not found`);
            const length = string.length;

            const newString = new stringModel({string: string,
                                                length: length
                                                });
            newString.save(function(err, newString) {
                if (err) {res.send(err)}
                else {res.json({string: string,
                                length: length
                })}
            })
        }
        else {
            console.log(`Entry found`);
            res.json(reply[0]);
        }
    })
});


router.post('/post', function (req, res, next) {
    const string = req.body.string;

    if (string == null) {
        res.json({message: "Please provide a string."})
    }

    else {
        stringModel.find({string: string}, `-_id -__v`, function (err, reply) {
            if (reply.length == 0) {
                console.log(`Entry not found`);
                const length = string.length;

                const newString = new stringModel({
                    string: string,
                    length: length
                });
                newString.save(function (err, newString) {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.json({
                            string: string,
                            length: length
                        })
                    }
                });
            }
            else {
                console.log(`Entry found`);
                res.json(reply[0]);
            }
        })
    }
});

router.delete('/:string', function (req, res, next) {
    const string = req.params.string;

    stringModel.findOneAndRemove({string: string}, function(err, reply) {
        if(err) {res.send(err)}
        else if(reply) {
            console.log(`string found`)
            res.json({message: 'String deleted.'})
        }
        else{
            console.log(`no string`)
            res.json({message: 'String not found'})
        }
    })
});

module.exports = router;
