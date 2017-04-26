var webdriver = require('selenium-webdriver');
var mongoose = require('mongoose');
var configDB = require('./configDB.js');
var Items = require('./database.js');
var now = new Date();
mongoose.connect(configDB.url); // connect to our database

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.firefox()).
build();
driver.manage().timeouts().implicitlyWait(5000);
driver.get('https://csgosell.com');

driver.findElement(webdriver.By.className('botsItems inventoryBox')).then(function(inv_b){
    //driver.wait(pars(1),2000);

    // driver.findElement(webdriver.By.xpath('//*[@id="botsIv"]/div[2]')).getAttribute('original-name').then(function (e){
    //     console.log('test');
    //     console.log(e);
    // });
    pars(2);
    driver.quit();
});

var min = 1, i = 1;//index
var name = ' ';
var cost = 101;
//pars(1);
//driver.wait(inv_b.isDisplayed(),2000);
// if(inv_b.isDisplayed()) {
//     inv_b.sendKeys(34).then(function () {
//         console.log("test");
//         pars(1);
//         driver.quit();
//     });
// }

function pars(j) {
    driver.findElement(webdriver.By.xpath('//*[@id="botsIv"]/div[' + j + ']')).then(function (inv) {
        var f = false;
        inv.getAttribute('original-name').then(function (n) {
            if (name!=n){
                name = n;
                inv.getAttribute('value').then(function(c){
                    cost = c;
                    console.log(name+' '+cost);
                    db_work(n, c, f);
                    // while(!f){
                    //     console.log('1');
                    //     if(f){
                    //        console.log('test');
                    //     }
                    // }
                });
            }
        });
        inv.sendKeys(34);
        j = j + 1;
        if (cost > 1) {
            pars(j);
        } else {
            return true;
        }
    });
}


function db_work (n, c, f) {
    Items.findOne({'name': n}, function(err, item){
        if (err)
            throw err;
        if (item) {
            if (item.csgosell.cost!=Number(c)){
                item.csgosell.cost = Number(c);
                item.csgosell.date = Number(now.getTime());
                item.save(function(err) {
                    if (err)
                        throw err;
                    f = true;
                });
            }
        }
        else {
            var newItem = new Items();
            newItem.name = n;
            newItem.csgosell.cost = Number(c);
            newItem.csgosell.date = Number(now.getTime());
            newItem.save(function(err) {
                if (err)
                    throw err;
                f = true;
            });
        }
    });
}