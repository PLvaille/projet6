//import de mongose et de son plugin unique validator fourni qui vérifie l'unicité d'une adresse mail dans la db
// Le mot de passe fera l'objet d'une validation particulière grâce au middleware verifPasword et au model password
const mongoose = require('mongoose');
//package pour valider correctement le champ email
require('mongoose-type-email');

const sanitizerPlugin = require('mongoose-sanitizer-plugin/lib/sanitizer-plugin');
const uniqueValidator = require('mongoose-unique-validator');

//définition du model userSchema
const userSchema = mongoose.Schema({
    email: { 
    //email string qui sera validé a l'aide du package
    type: mongoose.SchemaTypes.Email,
    //champ obligatoire
    required : true,
    //email unique
    unique : true,
    //respect le regex
    match: [/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/, "Veuillez saisir une adresse e-mail valide" ]},
    
    password: { 
    type: String, 
    required : true, }
});


//plugin pour garantir l'unicité des e-mail appliquées à userSchema
userSchema.plugin(uniqueValidator);

//plugin pour Mongoose qui purifie les champs du model userSchema avant de les enregistrer dans la base MongoDB.
userSchema.plugin(sanitizerPlugin);

//export du model mongooses sous le nom 'User' qui respectera le schema userSchema
module.exports = mongoose.model('User', userSchema);