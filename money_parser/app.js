var webdriver = require('selenium-webdriver');
var mongoose = require('mongoose');
var configDB = require('./configDB.js');
var Items = require('./database.js');
var now = new Date();
mongoose.connect(configDB.url); // connect to our database

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.firefox()).
build();
driver.get('https://cs.money');
driver.findElement(webdriver.By.className('invertory_container')).then(function(inv_b){
    //driver.wait(pars(1),2000);
    pars(1);
    driver.quit();
});

var min = 1, i = 1;//index
var name = ' ';
var cost = 101;


function pars(j) {
    driver.findElement(webdriver.By.xpath('//*[@id="inventory_bots"]/div[' + j + ']')).then(function (inv) {
        var f = false;
        inv.getAttribute('market_hash_name').then(function (n) {
            if (name!=n){
                name = n;
                inv.getAttribute('cost').then(function(c){
                    cost = c;
                    console.log(name+' '+cost);
                    db_work(n, c, now);

                });
            }
        });
        inv.sendKeys(34);
        j = j + 1;
        if (cost>1){
            pars(j);
        } else{
            return true;
        }
    });
}

function db_work (n, c) {
    Items.findOne({'name': n}, function(err, item){
        if (err)
            throw err;
        if (item) {
            if (item.csmoney.cost!=Number(c)){
                item.csmoney.cost = Number(c);
                item.csmoney.date = Number(now.getTime());
                item.save(function(err) {
                    if (err)
                        throw err;
                    return true;
                });
            }
        }
        else {
            var newItem = new Items();
            newItem.name = n;
            newItem.csmoney.cost = Number(c);
            newItem.csmoney.date = Number(now.getTime());
            newItem.save(function(err) {
                if (err)
                    throw err;
                return true;
            });
        }
    });
    return false;
}
