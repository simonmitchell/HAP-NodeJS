var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////
////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////
////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////

//These 3 values MUST be unique for every accessory you make. If they are not then IOS may have issues and mess
//the entire homekit setup and you will have to reset homekit on IOS.
var ACCESSORY_NAME = "Christmas Lights";     //give you accessory a name!
var ACCESSORY_USERNAME = "11:22:33:44:55:66";   //this is like a mac address for the accessory
var ACCESSORY_SERIAL = '123456789abc'           //unique serial address for the accessory

var MQTT_ID = 'homekit' + ACCESSORY_SERIAL
var MQTT_IP = '192.168.1.155'

var relayTopic = '/feeds'       //this will be the topic that you publish to, to update the accessory
var statusTopic = relayTopic + "/bulb1"; //this will the topic that this script subscribes to in order to get updates on the current status of the accessory

////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////
////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////
////////////////   CHANGE THESE VALUES FOR EVERY ACCESSORY   !!!!!!!!!!!!!//////////////////////////

// MQTT Setup
var mqtt = require('mqtt');

var options = {
	port: 1883,
	host: MQTT_IP,
	clientId: MQTT_ID
};

var client = mqtt.connect(options);
client.on('message', function(topic, message) {

	//incoming MQTT parse here
	if (topic == statusTopic) {

		if (message != 'p1' || message != 'p0') {   //ignore 'p0' and 'p1' moodlight activate/disable statuses

		  	var messageParsed = message.toString();    //split the message into strings
		  	if (messageParsed === 'true') {
		  		LightController.power = true;
		  		LightController.updateIOS();
		  	} else if (messageParsed === 'false') {
		  		LightController.power = false;
		  		LightController.updateIOS();
		  	} else if (messageParsed === '1') {
		  		LightController.power = !LightController.power;
		  		LightController.updateIOS();
		  	}
		}
	}
});

client.subscribe(statusTopic, {qos: 1});

var LightController = {

	name: ACCESSORY_NAME, //name of accessory
	pincode: "031-45-154",
	username: ACCESSORY_USERNAME, // MAC like address used by HomeKit to differentiate accessories. 
	manufacturer: "HAP-NodeJS", //manufacturer (optional)
	model: "v1.0", //model (optional)
	serialNumber: ACCESSORY_SERIAL, //serial number (optional)

	power: false, //curent power status
	outputLogs: true, //output logs

  	//set power state of accessory
 	setPower: function(status) { 

 		if (this.outputLogs) console.log("'%s' is now %s. Was previously %s", this.name, status ? "on" : "off", this.power ? "on" : "off");

	    if((status == true && this.power == false) || (status == false && this.power == true) ){
	      
			//if turned on set the brightness to the last brightness before it was turned off 
			if (status == true) {
				this.updateStatus(status);
				this.power = true;
			}

			//if turned off set the brightness to 0 and update the light
			else {
				this.updateStatus(status);
				this.power = false;
			}
	    }
 	},

	//get power of accessory
	getPower: function() {
		if (this.outputLogs) console.log("'%s' is %s", this.name, this.power ? "on" : "off");
		return this.power;
	},

  	//update the values on the IOS device all at once
	updateIOS: function(){
		bulb
			.getService(Service.Lightbulb)
			.getCharacteristic(Characteristic.On)
			.updateValue(this.power);
	},

	identify: function() { //identify the accessory
    	if (this.outputLogs) console.log("Identify the '%s'", this.name);
    },

	//Sends an mqtt update to the switch if needed
	updateStatus: function(status){
		if (this.power != status) {
			toPublish = "" + status;
			if (this.outputLogs) console.log("Update status '%s' '%s' ", statusTopic, toPublish);
			client.publish(statusTopic, toPublish);
		}
	}
}

var accUUID = uuid.generate('hap-nodejs:accessories:light' + LightController.name);

var bulb = exports.accessory = new Accessory(LightController.name, accUUID);

bulb.username = LightController.username;
bulb.pincode = LightController.pincode;

bulb.on('identify', function(paired, callback) {
	LightController.identify();
	callback();
});

bulb.addService(Service.Lightbulb, LightController.name).getCharacteristic(Characteristic.On)
.on('get', function(callback) {
	callback(null, LightController.getPower());
})
.on('set', function(value, callback) {

	LightController.setPower(value);
    // Our button is synchronous - this value has been successfully set
    // Invoke the callback when you finished processing the request
    // If it's going to take more than 1s to finish the request, try to invoke the callback
    // after getting the request instead of after finishing it. This avoids blocking other
    // requests from HomeKit.
	callback();
});