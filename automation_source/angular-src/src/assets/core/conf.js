exports.config = {
  params: {
    filename: "default"
  },
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["spec.sep.p1.js", "spec.sep.p2.js"],
  onPrepare: function() {
    // browser.driver.manage().window().maximize();
    browser.get(
      "https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/cdmslogin.html"
    );
    global.initiator = require("./utilities/initiator");
    global.el = require("./utilities/elements");
    global.cred = require('../../../inputs/credentials');
  },
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: "chrome"
  },
  allScriptsTimeout: 60000,
  // Framework to use. Jasmine is recommended.
  framework: "jasmine",
  resultJsonOutputFile: "result.json",

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 600000
  }
};

