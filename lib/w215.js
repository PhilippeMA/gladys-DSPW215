'use strict';

var inherits = require('util').inherits;
var dsp = require('hnap/js/soapclient');
// Task Scheduler and Rate Limiter for Node.JS
var Bottleneck = require("bottleneck");

var w215 = function (add_IP, PIN_Code) {

    this.dsp = dsp;
    this.url = "http://" + add_IP + "/HNAP1";
    this.username = 'admin';
    this.password = PIN_Code;

    this.login(function(loginStatus) {
        if (!loginStatus) {
            return;
        }
    });
};

//Allumage de la prise
var switchOn = function(callback){

  this.dsp.on().done(function(res) {
    //Boucle si switch KO
    console.log("Resultat du switch : " + res);
    if (res == "ERROR" || !res) {
        console.log("Nouvelle tentative...");
        self.login(function(loginStatus) {
          self.dsp.on().done(function(res) {});
         });
    }
    callback(null, res);
  });
};

//Allumage de la prise
var switchOff = function(callback){

  this.dsp.off().done(function(res) {
    //Boucle si switch KO
    console.log("Resultat du switch : " + res);
    if (res == "ERROR" || !res) {
        console.log("Nouvelle tentative...");
        self.login(function(loginStatus) {
          self.dsp.off().done(function(res) {});
         });
    }
    callback(null, res);
  });
};

w215.prototype.login = function(callback) {
    this.dsp.login(this.username, this.password, this.url).done(callback);
};

w215.prototype.setPowerState = function(state, callback) {
    var self = this;

    //Limitation du nb d'opérations lorsque plusieurs deviceState à modifier
    var limiter = new Bottleneck(1, 1000);

    if (state) {
        //Exécution de la commande avec le délai défini dans le limiter
        limiter.schedule(switchOn, callback);

    } else {
      //Exécution de la commande avec le délai défini dans le limiter
      limiter.schedule(switchOff, callback);
    }
};



module.exports = w215;
