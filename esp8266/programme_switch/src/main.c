#include "mgos.h"
#include <stdlib.h>
#include <stdio.h>
#include "gpio.h"
// #include "espressif/esp_common.h"
// #include <userinterface.h>

void wifi_fpm_open(void);

void wifi_fpm_set_wakeup_cb(void(*fpm_wakeup_cb_func)(void));

int wifi_fpm_do_sleep(int timeout);

typedef void (*fpm_wakeup_cb_func)(void);

fpm_wakeup_cb_func callback;

void *arg;

enum mgos_app_init_result mgos_app_init(void) {
	callback=0;
  	return MGOS_APP_INIT_SUCCESS;
}

void enableForceSleep() {
	// GPIO_ID_PIN(2) corresponds to GPIO2 on ESP8266-01 , GPIO_PIN_INTR_LOLEVEL for a logic low, can also do other interrupts, see gpio.h above
	gpio_pin_wakeup_enable(GPIO_ID_PIN(2), GPIO_PIN_INTR_LOLEVEL);
	wifi_fpm_open();
}

void fpmCallbackFunc() {
	printf( "Woken from sleep!\n" );
	// if(callback!=0) (*callback)();
}

void setForceSleepCallback(void (*fpm_wakeup_cb_func)(void), void *userdata) {

	wifi_fpm_set_wakeup_cb(fpmCallbackFunc);
	callback=fpm_wakeup_cb_func;
	arg=userdata;
}

int doSleep(int time) {
	if (time == 0) {
		return wifi_fpm_do_sleep(0xFFFFFFF);
	} else {
		return wifi_fpm_do_sleep(time);
	}
}