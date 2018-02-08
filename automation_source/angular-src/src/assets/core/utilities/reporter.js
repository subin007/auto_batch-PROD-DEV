var fs = require('fs');
var open = require('open');
var count = 0;
var fd = "jaz-report.log";
module.exports.myReporter = {

    jasmineStarted: function (suiteInfo) {
        console.log(`Running suite with ${suiteInfo.totalSpecsDefined} specifications \n\n`);
        fs.unlink('jaz-report.log',()=>{});
        fs.appendFileSync(fd, `*===========================================================================*\n`, () => { });
        fs.appendFileSync(fd, `|                Running Protractor Test Suite with ${suiteInfo.totalSpecsDefined} specifications `,()=>{});
        fs.appendFileSync(fd, `\n*===========================================================================*\n`, () => { });     
    },
    suiteStarted: function (result) {
        console.log('Suite started: \n' + result.description);
        fs.appendFileSync(fd, `\nStarted execution of Suite "${result.description}" \n`, () => { });
    },
    specStarted: function (result) {
        console.log('\nSpec started: \n' + result.description);
        fs.appendFileSync(fd, `\nSpec #${++count} : "${result.description}"\n ...started\n`,()=>{});
    },
    specDone: function (result) {
        console.log('Spec\'s result: ' + result.description + ' was ' + result.status);
        fs.appendFileSync(fd, `Result: "${result.description}" has  ${result.status}\n`,()=>{});
        for (var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Failure: ' + result.failedExpectations[i].message);
            fs.appendFileSync(fd, `Failure Reason: ${result.failedExpectations[i].message}\n`,()=>{});
            console.log(result.failedExpectations[i].stack);
        }
        console.log(result.passedExpectations.length);
    },
    suiteDone: function (result) {
        console.log('Suite: ' + result.description + ' was  ' + result.status);
        fs.appendFileSync(fd, `Suite: "${result.description}" was ${result.status}\n`,()=>{});
        for (var i = 0; i < result.failedExpectations.length; i++) {
            console.log('AfterAll ' + result.failedExpectations[i].message);
            fs.appendFileSync(fd, `AfterAll ${result.failedExpectations[i].message}\n`,()=>{});
            console.log(result.failedExpectations[i].stack);
        }
    },
    jasmineDone: function () {
        console.log('Finished suite');
        fs.appendFileSync(fd, `Finished suite\n`,()=>{});
        open(fd);
    }
};
