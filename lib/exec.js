var w215 = require('./w215.js');
var Promise = require('bluebird');
// Task Scheduler and Rate Limiter for Node.JS
var Bottleneck = require("bottleneck");
//Limitation du nb d'opérations lorsque plusieurs deviceState à modifier
var limiter = new Bottleneck(1, 500);

module.exports = function exec(params){

  var switchDevice = function(params, callback){        
      // Lecture des paramètres de la prise
      var device = params.deviceType.identifier.split(":");
      // adresse_IP:Pin_code
      var w215Switch = new w215(device[0], device[1]);

      return w215Switch.setPowerState(params.state.value, function(err, result) {
         if(err) return callback(err);

         return callback(result);
      });
  };

  if(params.deviceType.type !== 'binary'){
        return Promise.reject(new Error('Type not handled yet'));
  }

  return new Promise(function(resolve, reject){
      return limiter.submit(switchDevice, params, function(err, result) {
         if(err) return reject(err);

         return resolve(result);
      });
  });
};
