// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 80;
var mongoose = require('mongoose');
var configDB = require('./configDB.js');
var Item = require('./database.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
app.set('view engine', 'ejs'); // set up ejs for templating
app.use('/public', express.static('public'));
//app.use(express.static('/public'));
// routes ======================================================================
app.get('/', function(req, res) {
    Item.find({}, function(err, item){
        res.render('index.ejs',{
            items: item
        });
    });
});

app.get('/csm-sell', function(req, res) {
    Item.find({}, function(err, item){
        res.render('csm-sell.ejs',{
            items: item
        });
    });

});

app.get('/sell-csm', function(req, res) {
    Item.find({}, function(err, item){
        res.render('sell-csm.ejs',{
            items: item
        });
    });
});
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
