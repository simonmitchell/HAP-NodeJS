#HomeKit Philips Hue Switches
============================

This repo will serve as instruction on how to build, and set up physical HomeKit switches which will serve as controllers for your Philips Hue bulbs, or for that matter anything else you wish by editing the code!


##What you will need (Per switch notated with *)
============================

### For the hub
* A Rasberry Pi

### For the switch
* An ESP8266 esp-01 board* (Make sure to get the version with upgraded 1Mb memory)
* A USB to ESP8266 [adapter](https://www.amazon.co.uk/gp/product/B074FXDH3D)
* A solderable momentary switch button*

### For the power supply
* 1x 1000uF capacitor
* 1x 100nF ceramic disk capacitor
* 1x HT7333-A TO92 Voltage Reducer
* 1x 3.7V battery of your choice (I used 18650 lithium ion batteries)

## Steps
============================

Please note, these steps are from my personal experience working on a MacBook pro running macOS sierra. They may vary depending on operating system, however there are an abundance of instructional videos and blog-posts out there so you should be fine to work it out!

### Raspberry pi setup

We will be using the Raspberry pi as both the MQTT broker, and as the HAP-NodeJS server.

1. [Install node](https://github.com/sdesalas/node-pi-zero) on the Raspberry pi
1. Pull this repo into a working directory on the Raspberry pi
1. Setup HAP-NodeJS to run using `forever` on boot ([link](https://github.com/legotheboss/YouTube-files/wiki/(RPi)-Start-HAP-on-Reboot))
1. [Install mosquitto](https://learn.adafruit.com/diy-esp8266-home-security-with-lua-and-mqtt/configuring-mqtt-on-the-raspberry-pi) on the raspberry pi (Only follow steps 1-2)

### ESP8266 setup

#### Flashing the device
1. [Download](https://mongoose-os.com/software.html) and install mongoose-os
1. Connect the ESP8266 GPIO pin to ground to enable flashing mode on the chip. To do this I connected a switch to the correct pins on the back of my USB adapter so I can easily switch between flashing mode and normal mode.
1. Plug the USB adapter into your computer, with the ESP8266 plugged in.
1. Run this command in the terminal: `mos flash mos-esp8266-1M-latest` 
1. When the terminal starts reading:
```
Connecting to ESP8266 ROM, attempt 1 of 10,
Connecting to ESP8266 ROM, attempt 2 of 10,
```
plug in the ESP8266 module to the USB adapter.
1. When flashing has succeeded run: `mos wifi ROUTER_SSID ROUTER_PASSWORD` and wait for the chip to be configured

#### Coding the device
1. Run `mos` in the terminal, which should open up the mos gui in a browser window. Return your USB adapter to non-flashing mode and reinsert it with the ESP8266 attached. 
1. Open `conf0.json` in the device file browser, and edit the `mqtt->server` property to be the IP address of your Raspberry Pi.
1.  
