'use strict';

var inherits = require('util').inherits;
var dsp = require('hnap/js/soapclient');

var w215 = function (add_IP, PIN_Code) {

    this.dsp = dsp;
    this.url = "http://" + add_IP + "/HNAP1";
    this.username = 'admin';
    this.password = PIN_Code;

    var self = this;
    this.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
    });
};

w215.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

w215.prototype.setPowerState = function(state, callback) {
    var self = this;
    if (state) {
        this.dsp.on().done(function(res) {
            //Si la mise en route n'a pas fonctionnée, on recommence
            if (!res) {
              self.login(function(loginStatus) {
                self.dsp.on();
             });
            }
            callback(null, "power ON");
        });
    } else {
        this.dsp.off().done(function(res) {
            //Si la mise en route n'a pas fonctionnée, on recommence
            if (!res) {
              self.login(function(loginStatus) {
                self.dsp.off();
             });
            }
            callback(null, "power ON");
        });
    }
};

module.exports = w215;
