/**
 * HACK: Sometimes due to IBM issues,certain elements don't get loaded, create "isPresent" method to see if they are present..In the functions.js create 5 such functions that check to see if all the elements in the page are loaded or not.
     expect($('.item').isPresent()).toBeTruthy();
    expect(element(by.binding('person.name')).isPresent()).toBe(true);
    expect(element(by.binding('notPresent')).isPresent()).toBe(false);
 * NOTE: Locators: chaining is also possible, to get sub elements..
 * NOTE: "isPresent" method to see if an element is there
 * NOTE: import to spec.js file using var {*} = require('./elements.js')
 * NOTE: We can access .item>li by plain css selector syntax
 *       <ul class="items">
            <li>First</li>
            <li>Second</li>
            <li>Third</li>
        </ul>
        let list = element.all(by.css('.items li'));
        expect(list.get(0).getText()).toBe('First');
        expect(list.get(1).getText()).toBe('Second');
 * NOTE: element.all(by.model("device.alnValue")) fetches all the elements of model("device.alnValue") ie. in this case all the radio buttons and then gives a array of all such elements in the fetching order
 * NOTE: element.all(by.model("device.alnValue")).get(2) "array.get(nth index)" send the (n+1)th element in the array.
 * NOTE: Check isSelected()
            <input id="foo" type="checkbox">

            var foo = element(by.id('foo'));
            expect(foo.isSelected()).toBe(false);
            foo.click();
            expect(foo.isSelected()).toBe(true);

 * NOTE: .row() dosen't apply on by.model() but only on by.repeater() & .row() is chained to repeater while .get() is chained to element()
 */
//[1] Login Page One
var urlLoginOne = 'https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/cdmslogin.html';
var userIdOne = element(by.model('cdmslogin.username'));
var passwordOne = element(by.model('cdmslogin.password'));

//[2] Login Page Two
var urlLoginTwo = 'https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/login.html';
var userIdTwo = element(by.model('login.username'));
var passwordTwo = element(by.model('login.password'));
//[3] Common Login Button for both Login pages
var loginButton = element(by.buttonText('Login')); //type = "submit"

//[4] Device Search Page
var urlDeviceSearchPage = 'https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/devices.html';
    //Device Search Section
    var deviceNameSearchBox = element(by.model('userDevices.searchText'));
    var findButton = element(by.buttonText('Find')); // type= "button"
    //List of Devices
    var deviceIdLink = element(by.repeater('key in DeviceList').row(1).column('key.devId'));
    var deviceClaimStatus = element(by.xpath("(//td[contains(text(),'CLAIMED')])[2]"));
//[5] Attributes Page
var urlAttributesPage = 'https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/devicedetails.html';
    //Device Status Section
    var deviceStatus = element(by.className('fa fa-circle greencolor'));
    //Attribute Section
        //Attribute Search Box
        var attributeSearchBox = element(by.model('searchText'));
        //Attribute Manipulation Section
         //Pencil and Save Button
        var editIcon = element(by.className('fa fa-pencil'));
        var saveIcon = element(by.className("fa fa-floppy-o"));
        var historyTab = element(by.buttonText('View History'));
            //History Record Read
            var firstHistoryRecord = element(by.repeater('key in TimeSeries.tsData').row(0).column('key.strValue'));
            //Boolean Input
            var radioOnForSingle = element.all(by.model("device.alnValue")).get(0);
            var radioOffForSingle = element.all(by.model("device.alnValue")).get(1);
            //String or Number Input
            var inputAreaForSingle = element.all(by.model("device.alnValue")).get(0);

                var attributeListedV2 = element(by.repeater('device in devices').row(0)).element(by.binding('device.attributeName'));

                var activeValueV2 = element(by.repeater('device in devices').row(0)).element(by.binding('device.alnValue'));
                var activeValueV3 = element(by.repeater('device in devices').row(0).column('device.alnValue'));

                var activeTimeV2 = element(by.repeater('device in devices').row(0)).element(by.binding('device.updateValue')) ;
                var activeTimeV3 = element(by.repeater('device in devices').row(0).column('device.updateValue'));
                
                var nameAlias = element(by.repeater('device in devices').row(0).column('device.nameAlias'));
                var valueType = element(by.repeater('device in devices').row(0).column('device.dataType'));
//[6] Multi Attributes Page
var multiAttributeTab = element(by.linkText('Multi Attributes'));
// var urlMultiAttributesPage = `https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/multiattributes.html?DeviceID=${deviceId}&said=${said}`;
var urlMultiAttributesPage = function(id, said){
                                var id = id;var said = said;
                                return `https://whirlpool-api-servletwrapper-app-stage.mybluemix.net/multiattributes.html?DeviceID=${id}&said=${said}`;
                             };
    //Message Type section
    var selectType = element(by.xpath("//select"));
    var setAttribute = element(by.xpath("//option[contains(text(),'Set Attributes')]"));
    var getAttribute = element(by.xpath("//option[contains(text(),'Get Attributes')]"));
    //Attributes Section 
    //Attribute Search Box
    var multiAttributeSearchBox = element(by.model('searchText')); 
        //Attribute List Area
    var pushIcon = element(by.className('glyphicon centericon glyphicon-share-alt greencolor'));

    //Attribute Manipulation Section
    var removeIcon = element(by.className('centericon glyphicon glyphicon-remove redcolor'));
        //Boolean Input
        var activeTimeV3 = element(by.repeater('device in devices').row(0).column('device.updateValue'));
        
    var radioOnForMultiple = element(by.repeater('attribute in Attributestobesent').row(0).column('attribute.attributeName'));
    var radioOffForMultiple = element(by.repeater('attribute in Attributestobesent').row(0).column('attribute.attributeName'));
        //String or Number Input
    var inputAreaForMultiple = element(by.repeater('attribute in Attributestobesent').row(0).column('attribute.attributeName'));

    var sendAllButton = element(by.buttonText('Send All')); //type = "submit" 
//Shift back to Single Attribute Tab
var singleAttributeTab = element(by.linkText('Device Details'));

    /**
     * FIXME: Remember its going to be difficult in future, because it ain't straight forward like Single Attributes, but in Multiple go through this process
     *  Step 1: Push
     *  Step 2: Set the values and increment a global count
     *  Step 3: Go to next by reading from file, repeat Step 1.
     *  Step 4: Using the value from the count, reach to the nth element and the change the values.
     */
    // module.exports = {
    //     urlLoginOne, userIdOne, passwordOne, urlLoginTwo, userIdTwo, passwordTwo, loginButton, urlDeviceSearchPage, deviceNameSearchBox, findButton, deviceIdLinkV1, deviceIdLinkV2, urlAttributesPage, deviceStatus, attributeSearchBox, editIcon, saveIcon, radioOnForSingle, radioOffForSingle, inputAreaForSingle, attributeListedV1, attributeListedV2, activeValueV1, activeValueV2, activeTimeV1, activeTimeV2, urlMultiAttributesPage, messageType, setAttribute, getAttribute, multiAttributeSearchBox, pushIcon, removeIcon, radioOnForMultiple, radioOffForMultiple, inputAreaForMultiple, sendAllButton

    // }

    module.exports = {
        urlLoginOne, userIdOne, passwordOne,
        urlLoginTwo, userIdTwo, passwordTwo, loginButton,
        urlDeviceSearchPage, deviceNameSearchBox, findButton, deviceIdLink, deviceClaimStatus,
        urlAttributesPage, deviceStatus, attributeSearchBox, editIcon, saveIcon, historyTab, firstHistoryRecord,
        radioOnForSingle, radioOffForSingle, inputAreaForSingle, attributeListedV2, activeValueV2, activeValueV3, activeTimeV2, activeTimeV3, nameAlias, valueType,
    multiAttributeTab, urlMultiAttributesPage, selectType, setAttribute, getAttribute, multiAttributeSearchBox, pushIcon, removeIcon, radioOnForMultiple, radioOffForMultiple, inputAreaForMultiple, sendAllButton, singleAttributeTab

    }