load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_timer.js');
load("api_esp8266.js");
load('api_http.js');
load('api_lightSleep.js');

//***********************************************
//put the link in the quotes if using request...
let requestUrl = '';

//...or set io.adafruit mqtt settings and set feed name here:
let feedName = 'wifiButton04';

//some millisecond settings. adjust to your needs
let millisToTurnOff = 5*60000;
//***********************************************

// LIGHTSLEEP.setSleepType(1);
// let sleepType = LIGHTSLEEP.getSleepType();
// print("sleep type"+JSON.stringify(sleepType));

//
Timer.set(millisToTurnOff , false , function() {
  print("deep sleep");
  ESP8266.deepSleep(0);
}, null);

//trying mqtt
MQTT.setEventHandler(function(conn, ev, edata) 
{
	if (ev === MQTT.EV_CONNACK)
	{
		let topic = '/feeds/' + feedName;
		let ok = MQTT.pub(topic, JSON.stringify(1), 1);
		if(ok) print('sent mqtt')
		else print('failed mqtt');
		MQTT.setEventHandler(function(){}, null);
	}
}, null);