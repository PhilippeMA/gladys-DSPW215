'use strict';

var inherits = require('util').inherits;
var dsp = require('hnap/js/soapclient');
//const requireUncached = require('require-uncached');

var w215 = function (add_IP, PIN_Code) {

    this.dsp = dsp;
    this.name = 'DSP W215 Smart Plug';
    this.url = "http://" + add_IP + "/HNAP1";
    this.username = 'admin';
    this.password = PIN_Code;
    this.legacy = false;

    this.power = false;
    this.temperature = 0;
    this.consumption = 0;
    this.totalConsumption = 0;

    this.model = 'DSP W215';
    this.serialNumber = '12345';
    this.manufacturer = 'D-Link';
    var self = this;
    this.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
        self.getState(function(deviceStatus) {
            if (!deviceStatus) {
                return;
            }
            self.power = deviceStatus.power;
            self.temperature = deviceStatus.temperature;
            self.consumption = deviceStatus.consumption;
            self.totalConsumption = deviceStatus.totalConsumption;
        });
    });
};

w215.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

w215.prototype.getPowerState = function(callback) {
    this.getState(function(settings){
        callback(null, settings.power);
    });
}

w215.prototype.getTemperature = function(callback) {
    this.getState(function(settings){
        callback(null, settings.temperature);
    });
}

w215.prototype.setPowerState = function(state, callback) {
    var self = this;
    console.log(state);
    if (state) {
        this.dsp.on().done(function(res) {
            console.log(res);
            self.power = res;
            callback(null, "power ON");
        });
    } else {
        this.dsp.off().done(function(res) {
            console.log(res);
            self.power = res;
            callback(null, "power ON");
        });
    }
};

w215.prototype.getPowerConsumption = function(callback) {
    this.getState(function(settings){
        callback(null, settings.consumption);
    });
};

w215.prototype.getTotalPowerConsumption = function(callback) {
    this.getState(function(settings){
        callback(null, settings.totalConsumption);
    });
};

w215.prototype.getState = function(callback) {
    var self = this;
    this.retries = 0;
    this.dsp.state().done(function(state) {
        // Chances are of state is error we need to login again....
        if (state == 'ERROR') {
            if (self.retries >= 5) {
                return;
            }
            self.retries += 1;
            self.login(function(loginStatus) {
                self.getState(callback);
            });
            return;
        }
        self.dsp.totalConsumption().done(function(totalConsumption) {
            self.dsp.consumption().done(function(consumption) {
                self.dsp.temperature().done(function(temperature) {
                    var settings = {
                        power: state == 'true',
                        consumption: parseInt(consumption),
                        totalConsumption: parseFloat(totalConsumption),
                        temperature: parseFloat(temperature)
                    }
                    console.log("Values");
                    console.log(settings);
                    self.retries = 0;
                    callback(settings);
                });
            });
        });
    });
};

w215.prototype.identify = function(callback) {
    callback();
};

module.exports = w215;
