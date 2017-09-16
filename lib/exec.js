var WeMo = require('homebridge-w215');
var Promise = require('bluebird');

module.exports = function exec(params){

    var device = params.deviceType.identifier.split(":");
    var config = {name='', host='192.168.2.55', username='admin', password='814707', legacy=false}
    var w215Switch = new W215Accessory(log, config, api);

    if(params.deviceType.type !== 'binary'){
        return Promise.reject(new Error('Type not handled yet'));
    }

    return new Promise(function(resolve, reject){
        return w215Switch.setPowerState(params.state.value, function(err, result) {
           if(err) return reject(err);

           return resolve(result);
        });
    });  
};
