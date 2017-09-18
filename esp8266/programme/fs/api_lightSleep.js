let LIGHTSLEEP = {
	// ## **`Sys.deepSleep(microseconds)`**
 	// Deep Sleep given number of microseconds.
  	// Return value: none.
  	setSleepType: ffi('void wifi_fpm_set_sleep_type(int)'),
	
	getSleepType: ffi('int wifi_fpm_get_sleep_type(void)'),

	enableLightSleep: ffi('void wifi_fpm_open(void)'),

	sleep: ffi('sint wifi_fpm_do_sleep(void)'
};