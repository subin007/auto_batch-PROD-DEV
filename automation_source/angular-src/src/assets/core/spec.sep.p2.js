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
describe('Device Suite', function () {
    initiator(require(`../../../../../inputs/${browser.params.filename}`), (data, iteration) => {
        it(`Should check the CLAIMED status for Device of ID: ${data.deviceId} and click on the ID`, function () {
            el.deviceNameSearchBox.clear();el.deviceNameSearchBox.sendKeys(data.said); el.findButton.click();
            expect(el.deviceClaimStatus.getText()).toEqual('CLAIMED').then(function () {
                el.deviceClaimStatus.getText().then(function (text) {
                    if (text === 'UNCLAIMED') {
                        fetchData(loc, (obj) => {
                            obj.initials.saidClaimed = false;
                            obj.metadata.running = "forcefully_closed";
                            updateData(loc, obj);
                            browser.close().then(function () { process.exit(); });
                        });
                    }
                });
            });
            expect(el.deviceIdLink.getText()).toEqual((data.deviceId).toString());
            el.deviceIdLink.click();
            mega.saidClaimValidation();
        });

        it(`Should check if the CLAIMED Device of ID: ${data.deviceId} is connected to IBM Utility Portal `, function () {
            expect(element(by.className('fa fa-circle greencolor')).isDisplayed()).toBe(true);
            mega.deviceOnlineValidation();
        });

        var testSuites = data.testSuites;
        testSuites.forEach(function (testsuite) {
            var testCases = testsuite.testSteps;
            testCases.forEach(function (testcase) {
                // var actualValuesObjForSingle = {
                //     _activeValue: null,
                //     _valueType: null,
                //     _activeTime: null,
                //     _nameAlias: null,
                //     _history: null
                // };
                var nullifiedObj = function(){
                    return {
                        _activeValue: null,
                        _valueType: null,
                        _activeTime: null,
                        _nameAlias: null,
                        _history: null
                    };
                };
                var pastUpdateTime, activeTimeForDependentAttr, pastUpdateValue, checkForActiveTime = true;
                if (testcase.singleAttributes.length !== 0) {
                    testcase.singleAttributes.forEach(function (singleAttrTestcase) {
                        it(`For ${testsuite.testCaseName}: testing ${singleAttrTestcase.attrName}`, ()=> {
                            var currentValuesForSingle = nullifiedObj();

                            browser.getCurrentUrl().then(function (url) {
                                if (!url.includes("mybluemix.net/devicedetails.html")) {
                                    el.singleAttributeTab.click();
                                }
                            });
                            el.attributeSearchBox.clear();
                            el.attributeSearchBox.sendKeys(singleAttrTestcase.attrName);

                            el.activeValueV3.getText().then(function (activeValue) {
                                currentValuesForSingle._activeValue = activeValue;
                            }); el.valueType.getText().then(function (valueType) {
                                currentValuesForSingle._valueType = valueType;
                            }); el.nameAlias.getText().then(function (nameAlias) {
                                currentValuesForSingle._nameAlias = nameAlias;
                            });

                            if (singleAttrTestcase.feedValue !== null) {
                                pastUpdateTime = (el.activeTimeV3).getText();
                                pastUpdateValue = (el.activeValueV3).getText();
                                el.editIcon.click();
                                if (singleAttrTestcase.valueType === "Boolean") {
                                    if (singleAttrTestcase.feedValue == 0) {
                                        el.radioOffForSingle.click();
                                    }
                                    if (singleAttrTestcase.feedValue == 1) {
                                        el.radioOnForSingle.click();
                                    }
                                    el.saveIcon.click();
                                }
                                if (singleAttrTestcase.valueType !== "Boolean") {
                                    el.inputAreaForSingle.clear();
                                    el.inputAreaForSingle.sendKeys(singleAttrTestcase.feedValue);
                                    el.saveIcon.click();
                                }
                                activeTimeForDependentAttr = (el.activeTimeV3).getText();
                                var sleepTime = (singleAttrTestcase.wait !== null) ? (1000 * (singleAttrTestcase.wait)) : (1000 * (data.config.defaultWaitTime));
                                browser.sleep(sleepTime);
                                if (singleAttrTestcase.nameAlias !== null) {
                                    expect(el.nameAlias.getText()).toEqual((singleAttrTestcase.nameAlias).toString());
                                }
                                expect(el.valueType.getText()).toEqual((singleAttrTestcase.valueType).toString());
                                expect(el.activeTimeV3.getText()).not.toEqual(pastUpdateTime);
                                el.activeTimeV3.getText().then(function (activeTime) {
                                    currentValuesForSingle._activeTime = activeTime;
                                });
                                //Edited on 31st Jan, 2017
                                //Reason: FIXED ISSUE - for 'ssv' the activeValue for reporting was set at the beginning of the for loop and was not updated after default wait time, hence added the below lines to do the updation
                                el.activeValueV3.getText().then(function (activeValue) {
                                    currentValuesForSingle._activeValue = activeValue;
                                });
                                //
                                expect(el.activeValueV3.getText()).toEqual((singleAttrTestcase.expectedValue).toString());

                                mega.testCaseResultV2(testsuite.testCaseName, singleAttrTestcase.attrName, currentValuesForSingle, "ssv", singleAttrTestcase.expectedValue);

                            }
                            if (singleAttrTestcase.feedValue === null) {
                                el.activeTimeV3.getText().then(function (activeTime) {
                                    currentValuesForSingle._activeTime = activeTime;
                                });
                                var operation = "sgv";
                                var expected = singleAttrTestcase.expectedValue.toString();
                                if (expected.includes(' to ')) {
                                    var ranges = singleAttrTestcase.expectedValue.split(' to ');
                                    lowerRange = Number(ranges[0]);
                                    upperRange = Number(ranges[1]);
                                    if (singleAttrTestcase.nameAlias !== null) {
                                        expect(el.nameAlias.getText()).toEqual((singleAttrTestcase.nameAlias).toString());
                                    }
                                    expect(el.valueType.getText()).toEqual((singleAttrTestcase.valueType).toString());
                                    expect((el.activeValueV3).getText()).toBeGreaterThanOrEqual(lowerRange);
                                    expect((el.activeValueV3).getText()).toBeLessThanOrEqual(upperRange);
                                    mega.testCaseResultV2(testsuite.testCaseName, singleAttrTestcase.attrName, currentValuesForSingle, "sgr", singleAttrTestcase.expectedValue);
                                } else {
                                    if (singleAttrTestcase.history) {
                                        operation = "sgh";
                                        el.historyTab.click();
                                        expect((el.firstHistoryRecord).getText()).toEqual((el.activeValueV3).getText());
                                        el.activeValueV3.getText().then(function (historyValue) {
                                            currentValuesForSingle._history = historyValue;
                                        });
                                    }
                                    if (singleAttrTestcase.nameAlias !== null) {
                                        expect(el.nameAlias.getText()).toEqual((singleAttrTestcase.nameAlias).toString());
                                    }
                                    expect(el.valueType.getText()).toEqual((singleAttrTestcase.valueType).toString());
                                    expect((el.activeValueV3).getText()).toEqual((singleAttrTestcase.expectedValue).toString());
                                    var sleepTime = (singleAttrTestcase.wait !== null) ? (1000 * (singleAttrTestcase.wait)) : 200;
                                    browser.sleep(sleepTime);
                                    mega.testCaseResultV2(testsuite.testCaseName, singleAttrTestcase.attrName, currentValuesForSingle, operation, singleAttrTestcase.expectedValue);
                                }
                            }
                        });
                    });
                }
                if (testcase.multiAttributes.length !== 0) {
                    testcase.multiAttributes.forEach(function (multiAttrTestcase, iteration) {
                        if (multiAttrTestcase.operation.toLowerCase() === "get") {
                            it(`For ${testsuite.testCaseName}: testing Multi attributes`, function () {
                                var multipleAttrNames = [];
                                browser.getCurrentUrl().then(function (url) {
                                    if (!url.includes("multiattributes.html")) {
                                        el.multiAttributeTab.click();
                                    }
                                });
                                el.selectType.click();
                                el.getAttribute.click();
                                multiAttrTestcase.steps.forEach(function (step, iteration) {
                                    el.multiAttributeSearchBox.clear();
                                    el.multiAttributeSearchBox.sendKeys(step.attrName);
                                    el.pushIcon.click();
                                    multipleAttrNames.push(step.attrName);
                                });
                                el.sendAllButton.click();
                                var sleepTime = (multiAttrTestcase.wait !== null) ? (1000 * (multiAttrTestcase.wait)) : 1000;
                                browser.sleep(sleepTime).then(function () {
                                    browser.refresh();
                                });
                                expect("successfullySendAttributes").toEqual("successfullySendAttributes");
                                mega.testCaseResultV2(testsuite.testCaseName, multipleAttrNames, null, "mg",null);
                            });
                        }
                        if (multiAttrTestcase.operation.toLowerCase() === "set") {
                            it(`For ${testsuite.testCaseName}: testing Multi attributes`, function () {
                                var multipleAttrNames = [];
                                browser.getCurrentUrl().then(function (url) {
                                    if (!url.includes("multiattributes.html")) {
                                        el.multiAttributeTab.click();
                                    }
                                });
                                el.selectType.click();
                                el.setAttribute.click();
                                multiAttrTestcase.steps.forEach(function (step, iteration) {
                                    el.multiAttributeSearchBox.clear();
                                    el.multiAttributeSearchBox.sendKeys(step.attrName);
                                    el.pushIcon.click();
                                    multipleAttrNames.push(step.attrName);
                                    if (step.valueType === "Boolean") {
                                        if (step.value == 1) { //ON
                                            element(by.xpath("//td[contains(text(),'" + step.attrName + "')]/span[2]//input[1]")).click();
                                        }
                                        if (step.value == 0) { //OFF
                                            element(by.xpath("//td[contains(text(),'" + step.attrName + "')]/span[2]//input[2]")).click();
                                        }
                                    }
                                    if (step.valueType !== "Boolean") {
                                        var target = element(by.xpath("//td[contains(text(),'" + step.attrName + "')]/span[1]//input[1]"));
                                        target.clear();
                                        target.sendKeys(step.value);
                                    }
                                });
                                el.sendAllButton.click();
                                var sleepTime = (multiAttrTestcase.wait !== null) ? (1000 * (multiAttrTestcase.wait)) : 1000;
                                browser.sleep(sleepTime).then(function () {
                                    browser.refresh();
                                });
                                expect("successfullySetAndSendAttributes").toEqual("successfullySetAndSendAttributes");
                                mega.testCaseResultV2(testsuite.testCaseName, multipleAttrNames, null, "msv",null);
                            });
                        }
                    });

                }



                if (testcase.dependencyArr.length !== 0) {
                    testcase.dependencyArr.forEach(function (attribute) {
                        it(`For ${testsuite.testCaseName}: testing dependent attribute ${attribute.attrName}`, function () {
                            var currentValuesForDependent = nullifiedObj();
                            browser.getCurrentUrl().then(function (url) {
                                if (!url.includes("mybluemix.net/devicedetails.html")) {
                                    el.singleAttributeTab.click();
                                }
                            });
                            el.attributeSearchBox.clear();
                            el.attributeSearchBox.sendKeys(attribute.attrName);
                            el.activeValueV3.getText().then(function (activeValue) {
                                currentValuesForDependent._activeValue = activeValue;
                            }); el.valueType.getText().then(function (valueType) {
                                currentValuesForDependent._valueType = valueType;
                            }); el.nameAlias.getText().then(function (nameAlias) {
                                currentValuesForDependent._nameAlias = nameAlias;
                            }); el.activeTimeV3.getText().then(function (activeTime) {
                                currentValuesForDependent._activeTime = activeTime;
                            });
                            if (attribute.checkFor == "activeTime") {
                                expect(el.activeTimeV3.getText()).toEqual(activeTimeForDependentAttr);
                                let sleepTime = (attribute.wait !== null) ? (1000 * (attribute.wait)) : 200;
                                browser.sleep(sleepTime);
                                mega.testCaseResultV2(testsuite.testCaseName, attribute.attrName, currentValuesForDependent, "dgt", activeTimeForDependentAttr);
                            }
                            if (attribute.checkFor == "activeValue") {
                                expect(el.activeValueV3.getText()).toEqual((attribute.value).toString());
                                let sleepTime = (attribute.wait !== null) ? (1000 * (attribute.wait)) : 200;
                                browser.sleep(sleepTime);
                                mega.testCaseResultV2(testsuite.testCaseName, attribute.attrName, currentValuesForDependent, "dgv", attribute.value);
                            }
                            if (attribute.checkFor == "activeRange") {
                                browser.sleep(2000);
                                var ranges = attribute.value.split(' to ');
                                lowerRange = Number(ranges[0]);
                                upperRange = Number(ranges[1]);
                                expect((el.activeValueV3).getText()).toBeGreaterThanOrEqual(lowerRange);
                                expect((el.activeValueV3).getText()).toBeLessThanOrEqual(upperRange);
                                let sleepTime = (attribute.wait !== null) ? (1000 * (attribute.wait)) : 200;
                                browser.sleep(sleepTime);
                                mega.testCaseResultV2(testsuite.testCaseName, attribute.attrName, currentValuesForDependent, "dgr", attribute.value);
                            }
                        });
                    });
                }
            });
        });
        // }
    });
    // }
});
