var philipsHueInfo = require("./philipsHueInfo.js");

var exports = module.exports = {};

var execute = function(accessory, lightID, characteristic, value) {

	var http = require('http');
	var characteristic = characteristic.toLowerCase();

	var body = {};

	if(characteristic === "identify") {
		body = {alert:"select"};
	} else if(characteristic === "on") {
		body = {on:value};
	} else if(characteristic === "hue") {
		body = {hue:value};
	} else  if(characteristic === "brightness") {
		value = value/100;
		value = value*255;
		value = Math.round(value);
		body = {bri:value};
	} else if(characteristic === "saturation") {
		value = value/100;
		value = value*255;
		value = Math.round(value);
		body = {sat:value};
	}  
	
	var post_data = JSON.stringify(body); 
	
	// An object of options to indicate where to post to
	var post_options = {
	  host: philipsHueInfo.philipsHueIP,
	  port: '80',
	  family: 4,
	  path: '/api/' + philipsHueInfo.philipsHueUsername + '/lights/' + lightID + '/state/',
	  method: 'PUT',
	  headers: {
	      'Content-Type': 'application/json',
	      'Content-Length': post_data.length
	  }
	};
	
	// Set up the request
	var post_req = http.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	      console.log('Response: ' + chunk);
	  });
	});
	
	// post the data
	post_req.write(post_data);
	post_req.end(); 
	console.log("executed accessory: " + accessory + ", and characteristic: " + characteristic + ", with value: " +  value + "."); 
}

exports.execute = execute;