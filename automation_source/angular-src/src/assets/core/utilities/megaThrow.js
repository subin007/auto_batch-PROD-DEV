var fs = require('fs');
var jsonfile = require('jsonfile');
var megaThrow = function () {
    // var specWrapUp = function (testcaseName, attributeName, code) {
    //     var date = new Date();
    //     var atTime = date.getTime();
    //     var pushObj = {
    //         testcaseName: testcaseName,
    //         attributeName: attributeName,
    //         code: code,
    //         duration: 14787,
    //         failResults: [],
    //         passResults: [],
    //         atTime: atTime
    //     };
    //     this.specDone = function (result) {

    //         if (result.failedExpectations.length > 0) {
    //             for (var i = 0; i < result.failedExpectations.length; i++) {
    //                 var singleFailResult = {
    //                     matcherName: failedExpectations[i].matcherName,
    //                     message: failedExpectations[i].message,
    //                     stack: failedExpectations[i].stack,
    //                     passed: failedExpectations[i].passed,
    //                     expected: failedExpectations[i].expected,
    //                     actual: failedExpectations[i].actual
    //                 };
    //                 pushObj.failResults.push(singleFailResult);
    //             }
    //         }
    //         if (result.passedExpectations.length > 0) {
    //             for (var i = 0; i < result.passedExpectations.length; i++) {
    //                 var singlePassResult = {
    //                     matcherName: passedExpectations[i].matcherName,
    //                     message: passedExpectations[i].message,
    //                     stack: passedExpectations[i].stack,
    //                     passed: passedExpectations[i].passed,
    //                     expected: passedExpectations[i].expected,
    //                     actual: passedExpectations[i].actual
    //                 };
    //                 pushObj.passResults.push(singlePassResult);
    //             }
    //         }

    //     };
    //     return pushObj;
    // };
    var fetchData = function (loc, callback) {
        callback(jsonfile.readFileSync(loc));
    };
    var updateData = function (loc, data) {
        jsonfile.writeFileSync(loc, data, { spaces: 2, EOL: '\r\n' });
    };
    var loc = `./outputs/${browser.params.filename}`;


    beforeAll(function () {
        var loc = `./outputs/${browser.params.filename}`;
        var obj = fetchData(loc, function(obj){
            var date = new Date();
            var startedAt = date.getTime();
            obj.metadata.startedAt = startedAt;
            obj.metadata.finishedAt = null;
            obj.metadata.running = true;
            obj.initials.loginOne = null;
            obj.initials.loginTwo = null;
            obj.initials.saidClaimed = null;
            obj.initials.deviceOnline = null;
            obj.specSprint = [];
            updateData(loc, obj);
        });

    });
    afterAll(function () {
        var loc = `./outputs/${browser.params.filename}`;
        var obj = fetchData(loc, function (obj) {
            var date = new Date();
            var finishedAt = date.getTime();
            obj.metadata.finishedAt = finishedAt;
            obj.metadata.running = false;
            updateData(loc, obj);
        });

    });
    this.loginOneValidation = function () {
        jasmine.getEnv().addReporter(new function () {
            var loc = `./outputs/${browser.params.filename}`;
            var obj = fetchData(loc,(obj)=>{
            this.specDone = function (result) {
                if (result.failedExpectations.length > 0) {
                    obj.initials.loginOne = false;
                    updateData(loc, obj);
                } else {
                    obj.initials.loginOne = true;
                    updateData(loc, obj);
                }
            };
            });
        });
    };
    this.loginTwoValidation = function () {
        jasmine.getEnv().addReporter(new function () {
            var loc = `./outputs/${browser.params.filename}`;
            var obj = fetchData(loc, (obj) => {
                this.specDone = function (result) {
                    if (result.failedExpectations.length > 0) {
                        obj.initials.loginTwo = false;
                        updateData(loc, obj);
                    } else {
                        obj.initials.loginTwo = true;
                        updateData(loc, obj);
                    }
                };
            });
        });
    };

    this.saidClaimValidation = function () {
        jasmine.getEnv().addReporter(new function () {
            var loc = `./outputs/${browser.params.filename}`;
            var obj = fetchData(loc, (obj) => {
                this.specDone = function (result) {
                    if (result.failedExpectations.length > 0) {
                        obj.initials.saidClaimed = false;
                        updateData(loc, obj);
                    } else {
                        obj.initials.saidClaimed = true;
                        updateData(loc, obj);
                    }
                };
            });
        });
    };

    this.deviceOnlineValidation = function () {
        jasmine.getEnv().addReporter(new function () {
            var loc = `./outputs/${browser.params.filename}`;
            var obj = fetchData(loc, (obj) => {
                this.specDone = function (result) {
                    if (result.failedExpectations.length > 0) {
                        obj.initials.deviceOnline = false;
                        updateData(loc, obj);
                        // browser.close().then(function () { process.exit(); });
                    } else {
                        obj.initials.deviceOnline = true;
                        updateData(loc, obj);
                    }
                };
            });
        });
    };
    // this.testCaseResult = function (testcaseName, attributeName, code) {
    //     jasmine.getEnv().addReporter(new function () {

    //         jsonfile.readFile(loc, function (err, obj) {
    //             obj.specSprint.push(specWrapUp(testcaseName, attributeName, code));
    //             jsonfile.writeFileSync(loc, obj, { spaces: 2, EOL: '\r\n' })
    //         });
    //     });
    // };


    this.testCaseResultV2 = function (testcaseName, attributeName, currentValues, code, focusedExpectation) {
        jasmine.getEnv().addReporter(new function () {
            var loc = `./outputs/${browser.params.filename}`;
            fetchData(loc, (obj) => {
                // Verify whether the Pre conditiond are met, before running the first test
                if (obj.initials.deviceOnline === false) { browser.close().then(function () { obj.metadata.running = "forcefully_closed"; jsonfile.writeFileSync(loc, obj, { spaces: 2, EOL: '\r\n' }); process.exit(); }); }
                var date = new Date();
                var atTime = date.getTime();
                var pushObj = {
                    testcaseName: testcaseName,
                    attributeName: attributeName,
                    code: code,
                    duration: 14787,
                    currentValues: currentValues,
                    focusedExpectation: focusedExpectation,
                    failResults: [],
                    passResults: [],
                    atTime: atTime
                };
                this.specDone = function (result) {
                    if (result.failedExpectations.length > 0) {
                        for (var i = 0; i < result.failedExpectations.length; i++) {
                            var singleFailResult = {
                                matcherName: result.failedExpectations[i].matcherName,
                                message: result.failedExpectations[i].message,
                                stack: result.failedExpectations[i].stack,
                                passed: result.failedExpectations[i].passed,
                                expected: result.failedExpectations[i].expected,
                                actual: result.failedExpectations[i].actual
                            };
                            pushObj.failResults.push(singleFailResult);
                        }
                    } if (result.passedExpectations.length > 0) {
                        pushObj.passResults = result.passedExpectations.length;
                    }
                    obj.specSprint.push(pushObj);
                    jsonfile.writeFileSync(loc, obj, { spaces: 2, EOL: '\r\n' });
                };
            });
        });
    };

};


module.exports = new megaThrow();
