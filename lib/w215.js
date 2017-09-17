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
          //Boucle si switch KO
          console.log("Resultat du switch : " + res);
          if (res == "ERROR" || !res) {
              console.log("Nouvelle tentative...");
              self.login(function(loginStatus) {
                self.dsp.on();
               });
          }
          callback(null, "power ON");
        });
    } else {
        this.dsp.off().done(function(res) {
            //Boucle si switch KO
            console.log("Resultat du switch : " + res);
            if (res == "ERROR"|| !res) {
              console.log("Nouvelle tentative...");
              self.login(function(loginStatus) {
                self.dsp.off();
             });
            }
            callback(null, "power OFF");
        });
    }
};

module.exports = w215;
