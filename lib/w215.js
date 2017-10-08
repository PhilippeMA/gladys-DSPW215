'use strict';

var inherits = require('util').inherits;
var dsp = require('hnap/js/soapclient');

var w215 = function (add_IP, PIN_Code) {

    this.dsp = dsp;
    this.url = "http://" + add_IP + "/HNAP1";
    this.username = 'admin';
    this.password = PIN_Code;

};

w215.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

w215.prototype.setPowerState = function(state, callback) {
    var self = this;

    self.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
        else {
          if (state) {
              self.dsp.on().done(function(res) {
                //Boucle si switch KO
                if (res == "ERROR" || !res) {
                    self.login(function(res) {
                      self.dsp.on();
                      callback(null, "Demarrage du device : " + res + " après 2 essais");
                     });
                } else { callback(null, "Demarrage du device : " + res + " du 1er coup"); }
              });
          } else {
              self.dsp.off().done(function(res) {
                  //Boucle si switch KO
                  if (res == "ERROR" || !res) {
                    self.login(function(res) {
                      self.dsp.off();
                      callback(null, "Arret du device : " + res + " après 2 essais");
                   });
                  } else { callback(null, "Arret du device : " + res + " du 1er coup"); }
              });
          }
        }
    });
};

module.exports = w215;
