var w215 = require('./w215.js');
var Promise = require('bluebird');

module.exports = function exec(params){

    // Lecture des paramètres de la prise
    var device = params.deviceType.identifier.split(":");
    // A compléter : lecture des paramètres Gladys pour récupérer le mot de passe de la prise
    var w215Switch = new w215('192.168.2.55', '814707');

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
