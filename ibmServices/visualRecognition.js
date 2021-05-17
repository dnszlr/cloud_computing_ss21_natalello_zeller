const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const fs = require("fs");
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    authenticator: new IamAuthenticator({
        apikey: 'rKVYzwLu0v-S4loTNxWTAgk6LOWY26vCyb-g-WDKMp7G',
    }),
    serviceUrl: 'https://api.eu-de.visual-recognition.watson.cloud.ibm.com/instances/7379a5b2-332f-4cf0-8ef5-dfd1672bdacc',
});

shaedVisualRecognition = async function(req, res) {

    const classifyParams = {
        imagesFile: fs.createReadStream(req.files[0].path),
        owners: ['IBM'],
        threshold: 0.6,
    };

    return await visualRecognition.classify(classifyParams)
        .then(response => {
            let isPerson = false;
            let classes = response.result.images[0].classifiers[0].classes;
            for(let i in classes) {
                if(classes[i].class === 'person') {
                    isPerson = true;
                }
            }
            console.log(isPerson);
            if(isPerson) {
                return res.status(200).send();
            } else {
                return res.status(403).send();
            }
        })
        .catch(err => {
            return res.status(404).send();
        });
}

module.exports = {
    shaedVisualRecognition
}