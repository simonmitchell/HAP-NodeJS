load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_timer.js');
load("api_esp8266.js");
load('api_http.js');

//***********************************************
//put the link in the quotes if using request...

//...or set io.adafruit mqtt settings and set feed name here:
let feedName = 'bulb1';

GPIO.set_mode(2, GPIO.MODE_OUTPUT);

//trying mqtt
MQTT.setEventHandler(function(conn, ev, edata) 
{
	if (ev === MQTT.EV_CONNACK)
	{
		let topic = '/feeds/' + feedName;
		let ok = MQTT.pub(topic, JSON.stringify(1), 1);
		if(ok) print('sent mqtt')
		else print('failed mqtt');
		GPIO.write(2, 0);
		MQTT.setEventHandler(function(){}, null);
	}
}, null);

MQTT.sub('/feeds/' + feedName, function(conn, topic, msg) {
	// GPIO.write(pin, level)
	let level = JSON.parse(msg);
	if (level !== undefined) {
	  // Reverse because setting pin to 0 switches on lights
		GPIO.write(2, level === 1 ? 0 : 1);
	}
}, null);