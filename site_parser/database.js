/**
 * Created by Raptor on 19.03.2017.
 */
var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
    name: String,
    csmoney: {
        cost: Number,
        date: Number
    },
    csgosell: {
        cost: Number,
        date: Number
    },
    lootfarm: {
        cost: Number,
        have: Number,
        max: Number,
        date: Number
    }
});

module.exports = mongoose.model('Data', dataSchema);