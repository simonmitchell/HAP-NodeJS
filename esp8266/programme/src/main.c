#include "mgos.h"
#include <stdlib.h>
// #include "espressif/esp_common.h"
// #include <userinterface.h>

enum mgos_app_init_result mgos_app_init(void) {
  return MGOS_APP_INIT_SUCCESS;
}

// void set_sleep_type(int type) {
  // 0: NONE
  // 1: LIGHT_SLEEP
  // 2: MODEM_SLEEP
  // wifi_fpm_set_sleep_type(type);
// }