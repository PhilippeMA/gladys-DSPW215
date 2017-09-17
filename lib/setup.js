module.exports = function(){
  // Je n'ai trouvé aucune API qui permet la découverte des prises
  // => Solution de contounement : vous alimentez les paramètres Gladys (1 par prise : adresse_IP:PIN_Code)

  var noMoreDevice = false;
  var nbDevices = 0;
  var tmp = 0;
  var URL_PIN = null;

  //while(!noMoreDevice){
    URL_PIN = null;
    tmp = nbDevices + 1;
    console.log("Valeur utilisée pour le getParam  : W215_PRISE_" + tmp);
    gladys.param.getValue("W215_PRISE_" + tmp)
      .then(function(param){

        URL_PIN = param.split(":");
        console.log("Création du device : " + URL_PIN[0]);
        nbDevices++;
        //Création du nouveau device
        var newDevice = {
          device: {
            name: 'W215_PRISE_' + nbDevices,
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

        gladys.device.create(newDevice);

      })
      .catch(function(err){
        //Plus aucune prise
        noMoreDevice = true;
        return Promise.reject(new Error('getParam sans réponse : ' + err));
      });

  //} //fin de la boucle

  return Promise.resolve();
};
