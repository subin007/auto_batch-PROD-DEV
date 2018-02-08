var fs = require('fs');
var jsonfile = require('jsonfile');
var mega = require('./utilities/megaThrow');
var fetchData = function (loc, callback) {
    callback(jsonfile.readFileSync(loc));
};
var updateData = function (loc, data) {
    jsonfile.writeFileSync(loc, data, { spaces: 2, EOL: '\r\n' });
};
var loc = `./outputs/${browser.params.filename}`;
describe('Login Suite ', () => {
    it(`Should pass level 1 authentication`, function () {
        el.userIdOne.sendKeys(cred.userIdOne); el.passwordOne.sendKeys(cred.passwordOne); el.loginButton.click();
        expect(browser.getCurrentUrl()).toEqual(el.urlLoginTwo).then(function () {
            browser.getCurrentUrl().then(function (url) {
                if (!url.includes("mybluemix.net/login.html")) {
                    fetchData(loc, (obj) => {
                                obj.initials.loginOne = false;
                                obj.metadata.running = "forcefully_closed";
                                updateData(loc, obj);
                        browser.close().then(function () { process.exit(); });
                    });
                }
            });
        });
        mega.loginOneValidation();
    });
    it(`Should pass level 2 authentication`, function () {
        el.userIdTwo.sendKeys(cred.userIdTwo); el.passwordTwo.sendKeys(cred.passwordTwo); el.loginButton.click();
        expect(browser.getCurrentUrl()).toEqual(el.urlDeviceSearchPage).then(function () {
            browser.getCurrentUrl().then(function (url) {
                if (!url.includes("devices.html")) {
                    fetchData(loc, (obj) => {
                        obj.initials.loginTwo = false;
                        obj.metadata.running = "forcefully_closed";
                        updateData(loc, obj);
                        browser.close().then(function () { process.exit(); });
                    });
                }
            });
        });
        mega.loginTwoValidation();
    });
});



