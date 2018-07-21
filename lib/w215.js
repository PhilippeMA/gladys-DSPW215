'use strict';

var inherits = require('util').inherits;
const requireUncached = require('require-uncached');
//var dsp = require('hnap/js/soapclient');

var w215 = function (add_IP, PIN_Code) {

    this.dsp = requireUncached('hnap/js/soapclient');
    this.url = "http://" + add_IP + "/HNAP1";
    this.username = 'admin';
    this.password = PIN_Code;

};

w215.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

w215.prototype.getPowerState = function(callback) {
        this.getState(function(settings){
                return callback(settings.power);
        });
};

w215.prototype.setPowerState = function(state, callback) {
    var self = this;
    var deviceState;

    self.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
        else {
                //Récupération de l'état du device avant de changer son état
                self.getPowerState(function(deviceON){
                        // N'allume la prise que si elle est éteinte sinon ne l'éteint que si elle est allumée
                        if (state == 1 && !deviceON) {
                                self.dsp.on().done(function(res) {
                                        if (res == "ERROR") {
                                                callback(null, res);
                                        } else {
                                                callback(null, false);
                                        }
                                });
                        } else if (state == 0 && deviceON) {
                                self.dsp.off().done(function(res) {
                                        if (res == "ERROR") {
                                                callback(null, res);
                                        } else {
                                                callback(null, false);
                                        }
                                });
                        } else {
                                // Initialisation de l'état dans Gladys
                                callback(null, false);
                        }
                });
        }
    });
};

w215.prototype.getState = function(callback) {
    var self = this;
    this.retries = 0;
    this.dsp.state().done(function(state) {
        self.dsp.totalConsumption().done(function(totalConsumption) {
            self.dsp.consumption().done(function(consumption) {
                self.dsp.temperature().done(function(temperature) {
                    var settings = {
                        power: state == 'true',
                        consumption: parseInt(consumption),
                        totalConsumption: parseFloat(totalConsumption),
                        temperature: parseFloat(temperature)
                    }
                    return callback(settings);
                });
            });
        });
    });
};

module.exports = w215;
