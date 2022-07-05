//package multer pour gérer les fichier entrant en HTTP
const multer = require('multer');

//définition format des images
const MIME_TYPES = {
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpg',
  'image/png' : 'png'
};

//configuratiton du stockage sur le disque
const storage = multer.diskStorage({
    //desitanation 'images' 
    destination : (req, file, callback) => {
        callback(null, 'images');
    },
    //nom de fichier 
    filename : (req, file, callback) => {
        //on remplace les espaces eventuels par des underscores
        let name = file.originalname.split(' ').join('_');
        //on ajoute l'extension de l'image
        let extension = MIME_TYPES[file.mimetype];
        name = name.replace("." + extension, "_");
        //le nom final sera : le nom original splité auquel on ajoute un timestamp et l'extension ex : sauce_1122334455667.jpg
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage : storage }).single('image');