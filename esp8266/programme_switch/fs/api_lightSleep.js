let LightSleep = {
	// ## **`Sys.deepSleep(microseconds)`**
 	// Deep Sleep given number of microseconds.
  	// Return value: none.
  	setSleepType: ffi('void wifi_fpm_set_sleep_type(int)'),
	
	getSleepType: ffi('int wifi_fpm_get_sleep_type(void)'),

	enableLightSleep: ffi('void enableForceSleep(void)'),

	setCallback: ffi('void setForceSleepCallback(void(*)(userdata), userdata)'),

	sleep: ffi('int doSleep(int)')

	// MAX_SLEEP_TIME:  
};