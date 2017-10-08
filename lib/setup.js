module.exports = function(){
  // Je n'ai trouvé aucune API qui permet la découverte des prises
  // => Solution de contounement : vous alimentez les paramètres Gladys (W215_PRISE : adresse_IP:PIN_Code)

  var URL_PIN = null;

  URL_PIN = null;
  console.log("Valeur utilisée pour le getParam  : W215_PRISE");

  return gladys.param.getValue("W215_PRISE")
    .then(function(param){

      URL_PIN = param.split(":");
      console.log("Création du device : " + URL_PIN[0]);
      //Création du nouveau device
      var newDevice = {
        device: {
          name: 'W215_PRISE',
          protocol: 'wifi',
          service: 'w215',
          identifier: URL_PIN[0] + ':' + URL_PIN[1],
        },
        types: [
          {
            type: 'binary',
            category: 'outlet',
            sensor: false,
            min: 0,
            max: 1
          }
        ]
      };

      return gladys.device.create(newDevice);

    })
    .catch(function(err){
      //Aucun paramétrage trouvé
      return Promise.reject(new Error('No device found...'));
    });
};
